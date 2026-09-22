(function () {
  const cursor = document.createElement('div');
  cursor.setAttribute('aria-hidden', 'true');
  cursor.style.position = 'fixed';
  cursor.style.width = '18px';
  cursor.style.height = '18px';
  cursor.style.borderRadius = '50%';
  cursor.style.border = '1px solid rgba(105, 243, 255, 0.8)';
  cursor.style.pointerEvents = 'none';
  cursor.style.zIndex = '9999';
  cursor.style.opacity = '0';
  cursor.style.transform = 'translate(-50%, -50%)';
  cursor.style.transition = 'opacity 0.2s ease';
  document.body.appendChild(cursor);

  window.addEventListener('pointermove', (event) => {
    cursor.style.opacity = '1';
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });

  window.addEventListener('pointerleave', () => {
    cursor.style.opacity = '0';
  });
})();
