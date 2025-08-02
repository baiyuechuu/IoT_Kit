# Documentation Images

This folder contains images used in the README documentation.

## Required Images:

### 1. `dht11_protocol.png`
- Overview diagram showing DHT11 communication protocol
- Should show ESP32 ↔ DHT11 communication flow
- Include start signal, response, and data transmission phases

### 2. `dht11_timing.png` 
- Detailed timing diagram showing:
  - Start signal timing (18-20ms low, 20-40μs high)
  - Response signal (80μs low + 80μs high)
  - Data bit timing (50μs low + 26-28μs/'0' or 70μs/'1' high)
  - Complete 40-bit data frame

### 3. `hardware_connection.png`
- Physical connection diagram showing:
  - DHT11 sensor pinout
  - ESP32 GPIO connections
  - Breadboard or schematic view
  - Wire connections (VCC, GND, DATA)

## Image Guidelines:

- **Format**: PNG or JPG
- **Size**: Optimal for GitHub display (max 800px width)
- **Quality**: Clear and readable text/labels
- **Style**: Professional technical diagrams

## Tools for Creating Images:

- **Circuit Diagrams**: Fritzing, KiCad, Eagle
- **Timing Diagrams**: WaveDrom, Digital oscilloscope screenshots
- **Protocol Diagrams**: Draw.io, Lucidchart, PowerPoint

## Usage in README:

Images are referenced using relative paths:
```markdown
![Description](docs/images/filename.png)
```

## Contributing:

When adding new images:
1. Place in this `docs/images/` folder
2. Use descriptive filenames
3. Update this README if adding new image types
4. Optimize file size for web display
