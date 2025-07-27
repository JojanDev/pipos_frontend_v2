export const renderLayout = async (container, layout) => {
  const response = await fetch(`./src/layouts/${layout}`);
  const html = await response.text();
  container.innerHTML = html;
};
