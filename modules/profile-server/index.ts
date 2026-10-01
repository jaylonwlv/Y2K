import { requireOptionalNativeModule } from 'expo';

type ProfileServerModule = {
  /** Serves the profile on 127.0.0.1 for about a minute; resolves with the port. */
  serve(profile: string): Promise<number>;
  stop(): void;
};

/** null on web and in builds made before this module was added. */
export const ProfileServer = requireOptionalNativeModule<ProfileServerModule>('ProfileServer');
