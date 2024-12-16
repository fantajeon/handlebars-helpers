export const applyStyles = cssTemplate => ({
  run: () => {
    const styleElement = document.createElement('style');
    styleElement.textContent = cssTemplate;
    styleElement.id = 'dscc-custom-style';
    
    const existingStyle = document.getElementById('dscc-custom-style');
    if (existingStyle) {
      existingStyle.remove();
    }
    document.head.appendChild(styleElement);
    return { cssTemplate };
  }
}); 