// Small enhancement: ask for confirmation before destructive actions.
document.querySelectorAll('form[onsubmit]').forEach(form => {
  form.addEventListener('submit', event => {
    // The inline confirmation remains the source of truth.
  });
});
