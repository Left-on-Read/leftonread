import '@testing-library/jest-dom'

jest.mock('./src/utils/gtag')

if (!SVGElement.prototype.getTotalLength) {
  SVGElement.prototype.getTotalLength = () => 1
}

global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }
  }
