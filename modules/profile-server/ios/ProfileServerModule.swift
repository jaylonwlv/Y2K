import ExpoModulesCore
import Network
import UIKit

/// iOS only installs configuration profiles that Safari downloads, so the app serves the profile
/// on 127.0.0.1 for a minute and opens its URL in Safari. Loopback traffic needs no permission.
public class ProfileServerModule: Module {
  private var listener: NWListener?
  private var body = Data()
  private var backgroundTask: UIBackgroundTaskIdentifier = .invalid
  private let queue = DispatchQueue(label: "ProfileServer")

  public func definition() -> ModuleDefinition {
    Name("ProfileServer")

    /// Starts serving `profile` (the .mobileconfig XML) and resolves with the port.
    AsyncFunction("serve") { (profile: String, promise: Promise) in
      self.stop()
      self.body = Data(profile.utf8)

      let parameters = NWParameters.tcp
      parameters.requiredInterfaceType = .loopback
      parameters.allowLocalEndpointReuse = true
      let listener: NWListener
      do {
        listener = try NWListener(using: parameters, on: .any)
      } catch {
        promise.reject("ERR_PROFILE_SERVER", error.localizedDescription)
        return
      }

      var settled = false
      listener.stateUpdateHandler = { [weak self] state in
        switch state {
        case .ready:
          guard !settled, let port = listener.port?.rawValue else { return }
          settled = true
          promise.resolve(Int(port))
        case .failed(let error):
          self?.stop()
          guard !settled else { return }
          settled = true
          promise.reject("ERR_PROFILE_SERVER", error.localizedDescription)
        default:
          break
        }
      }
      listener.newConnectionHandler = { [weak self] connection in
        self?.respond(on: connection)
      }
      self.listener = listener
      listener.start(queue: self.queue)

      // Keep serving while Safari is in front; iOS suspends the app soon after it leaves.
      DispatchQueue.main.async {
        self.backgroundTask = UIApplication.shared.beginBackgroundTask(withName: "ProfileServer") { [weak self] in
          self?.stop()
        }
      }
      self.queue.asyncAfter(deadline: .now() + 60) { [weak self] in
        self?.stop()
      }
    }

    Function("stop") {
      self.stop()
    }

    OnDestroy {
      self.stop()
    }
  }

  private func respond(on connection: NWConnection) {
    connection.start(queue: queue)
    connection.receive(minimumIncompleteLength: 1, maximumLength: 16 * 1024) { [weak self] data, _, _, _ in
      guard let self else { return }
      let request = String(decoding: data ?? Data(), as: UTF8.self)
      let requestLine = request.split(separator: "\r\n", maxSplits: 1).first.map(String.init) ?? ""
      let wantsProfile = requestLine.hasPrefix("GET ") && requestLine.contains(".mobileconfig")

      var response: Data
      if wantsProfile {
        let head = [
          "HTTP/1.1 200 OK",
          "Content-Type: application/x-apple-aspen-config",
          "Content-Length: \(self.body.count)",
          "Cache-Control: no-store",
          "Connection: close",
          "",
          "",
        ].joined(separator: "\r\n")
        response = Data(head.utf8)
        response.append(self.body)
      } else {
        response = Data("HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\nConnection: close\r\n\r\n".utf8)
      }
      connection.send(content: response, completion: .contentProcessed { _ in
        connection.cancel()
      })
    }
  }

  private func stop() {
    listener?.cancel()
    listener = nil
    let task = backgroundTask
    backgroundTask = .invalid
    if task != .invalid {
      DispatchQueue.main.async {
        UIApplication.shared.endBackgroundTask(task)
      }
    }
  }
}
