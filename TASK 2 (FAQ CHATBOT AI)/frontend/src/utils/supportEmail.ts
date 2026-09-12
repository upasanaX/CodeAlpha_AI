export const triggerSupportEmailModal = (subject?: string, body?: string) => {
  window.dispatchEvent(
    new CustomEvent('open-support-modal', {
      detail: { subject, body },
    })
  );
};
