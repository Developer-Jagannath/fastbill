interface IPrintOptions {
    textLeft?: string; // Text on the left side (optional)
    textRight?: string; // Text on the right side (optional)
    lineLength?: number; // Total line length (default 31)
    alignment?: 'left' | 'right' | 'center'; // Single text alignment
    bold?: boolean; // Apply bold text
    underline?: boolean; // Apply underline
    fontSize?: 'big' | 'tall'; // Font size
    newLine?: boolean; // Add newline at the end
  }
  
  export const printLine = ({
    textLeft = '',
    textRight = '',
    lineLength = 31,
    alignment = 'left',
    bold = false,
    underline = false,
    fontSize,
    newLine = false,
  }: IPrintOptions): string => {
    const space = ' ';
    const leftLength = textLeft.length;
    const rightLength = textRight.length;
  
    // Apply formatting tags
    const formatStart = `${bold ? '<b>' : ''}${underline ? '<u>' : ''}${
      fontSize ? `<font size='${fontSize}'>` : ''
    }`;
    const formatEnd = `${fontSize ? '</font>' : ''}${underline ? '</u>' : ''}${
      bold ? '</b>' : ''
    }`;
  
    if (textLeft && textRight) {
      // Case: Left and Right Text
      const availableSpace = lineLength - (leftLength + rightLength);
      if (availableSpace < 0) {
        // Truncate if combined text exceeds lineLength
        return `[L]${formatStart}${textLeft.slice(0, leftLength + availableSpace)}${space}${textRight.slice(0, rightLength + availableSpace)}${formatEnd}${newLine ? '\n' : ''}`;
      }
      return `[L]${formatStart}${textLeft}${space.repeat(availableSpace)}${textRight}${formatEnd}${newLine ? '\n' : ''}`;
    }
  
    const text = textLeft || textRight; // Use either left or right text for alignment
    const textLength = text.length;
  
    if (textLength >= lineLength) {
      return `[L]${formatStart}${text.slice(0, lineLength)}${formatEnd}${newLine ? '\n' : ''}`; // Truncate if text exceeds line length
    }
  
    const padding = lineLength - textLength;
  
    let formattedText = '';
    switch (alignment) {
      case 'left':
        formattedText = text + space.repeat(padding);
        break;
      case 'right':
        formattedText = space.repeat(padding) + text;
        break;
      case 'center':
        const leftPadding = Math.floor(padding / 2);
        const rightPadding = padding - leftPadding;
        formattedText = space.repeat(leftPadding) + text + space.repeat(rightPadding);
        break;
      default:
        throw new Error("Invalid alignment type. Use 'left', 'right', or 'center'.");
    }
  
    return `[L]${formatStart}${formattedText}${formatEnd}${newLine ? '\n' : ''}`;
  };
  

  export const repeatTextToFitLine = (text: string, lineLength = 32): string => {
    if (!text || text.length === 0) {
      throw new Error("Text cannot be empty");
    }
  
    let repeatedText = text;
    
    while (repeatedText.length < lineLength) {
      repeatedText += text; // Append the text repeatedly
    }
  
    // Trim to exactly `lineLength`
    return repeatedText.slice(0, lineLength);
  };

  export const rearrangeArray = (data: (number | string)[]): string => {
    // Ensure data is an array
    if (!Array.isArray(data)) {
        throw new Error("Input must be an array");
    }

    // Clone the array to avoid modifying the original
    const clonedData = [...data];

    // If the array length is odd, add an empty string at the end
    if (clonedData.length % 2 !== 0) {
        clonedData.push(" ");
    }

    const midIndex = Math.ceil(clonedData.length / 2); // Determine midpoint
    const firstHalf = clonedData.slice(0, midIndex); // First half
    const secondHalf = clonedData.slice(midIndex); // Second half

    let result = '';

    // Interleave elements from both halves and use printLine
    for (let i = 0; i < firstHalf.length; i++) {
        result += printLine({
            textLeft: firstHalf[i]?.toString() || '',
            textRight: secondHalf[i]?.toString() || '',
        });  // Add newline after each line
    }

    return result;
  };
  