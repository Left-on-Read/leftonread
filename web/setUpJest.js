import '@testing-library/jest-dom'

jest.mock('./src/utils/gtag')

if (!SVGElement.prototype.getTotalLength) {
  SVGElement.prototype.getTotalLength = () => 1
}
