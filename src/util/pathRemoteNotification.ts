import { ReferenceNotification } from '../interface/ReferenceNotificationPath';

export async function pathRemoteNotification(
  referencesNotification: ReferenceNotification
) {
  const response = await fetch(referencesNotification.urlNotification, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(referencesNotification.contentNotification),
  });
  return response;
}
