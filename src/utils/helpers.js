export function setButtonText(
  button,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    button.textContent = loadingText;
    //set the loading text
    console.log(`Setting text to ${loadingText}`);
  } else {
    //set not loading text/default text
    button.textContent = defaultText;
  }
}
