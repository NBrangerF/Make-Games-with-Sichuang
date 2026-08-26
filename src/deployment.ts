export const LOCAL_STORAGE_PREFIX = 'tabletop-workshop-'

export const deploymentInfo = {
  publicTrial: import.meta.env.VITE_PUBLIC_TRIAL_MODE === 'true',
  hostLabel: import.meta.env.VITE_PUBLIC_HOST_LABEL?.trim() || '本地预览',
  privacyContact: import.meta.env.VITE_PRIVACY_CONTACT?.trim() || '',
  buildId: import.meta.env.VITE_BUILD_ID?.trim() || 'local-dev',
}

export const isPublicTrialConfigured = deploymentInfo.publicTrial
  && Boolean(deploymentInfo.privacyContact)
  && deploymentInfo.hostLabel !== '本地预览'
