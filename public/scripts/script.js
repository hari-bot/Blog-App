document.addEventListener('keydown', function (event) {
  // Check if Ctrl + S is pressed
  if (event.ctrlKey && event.key === 's') {
      event.preventDefault(); // Prevent the default browser save action

      // Trigger form submission
      submitForm();
  }
});

function submitForm() {
  // Replace 'myForm' with the actual ID of your form
  document.getElementById('myForm').submit();
}


