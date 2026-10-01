Pod::Spec.new do |s|
  s.name           = 'ProfileServer'
  s.version        = '1.0.0'
  s.summary        = 'Hands a configuration profile to Safari over localhost.'
  s.description    = s.summary
  s.license        = 'MIT'
  s.author         = 'Y2K Home'
  s.homepage       = 'https://github.com/jaylonwlv/Y2K'
  s.platforms      = { :ios => '16.4' }
  s.swift_version  = '5.9'
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.source_files = "**/*.{h,m,swift}"
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }
end
