export function getAuthorizationHeadersObject() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  };
}

export const unauthorizedErrorMessage =
  "FAILED. Your access has expired. Please, login in the new window opened and come back to save your work on this window afterwards. DO NOT close this window unless you want to discard your changes.";

export const unauthorizedAccessToPage =
  "You're not authorized to access this page.";
