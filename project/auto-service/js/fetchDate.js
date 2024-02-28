export const fetchDate = async () => {
  try {
    const response = await fetch("https://playful-plausible-rook.glitch.me/api");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`ОШибка при получении данных: ${error}`);
  }
};
