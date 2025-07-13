# EcoCycle - Environmental Impact Calculator

EcoCycle is a comprehensive e-waste management platform that helps users understand the environmental impact of their electronic devices and find responsible disposal options.

## Features

### 🧮 Enhanced Impact Calculator
- **Real Scientific Data**: Uses EPA, UNEP, and academic research data
- **8 Device Types**: Smartphones, laptops, tablets, desktops, TVs, monitors, printers, gaming consoles
- **Detailed Analysis**: CO2 emissions, material recovery, environmental comparisons
- **Smart Recommendations**: Personalized disposal and recycling advice

### 📊 Environmental Insights
- **Carbon Footprint**: Manufacturing and usage CO2 emissions
- **Material Recovery**: Gold, copper, rare earth elements, and other valuable materials
- **Environmental Comparisons**: Tree equivalents, car miles, smartphone equivalents
- **Device Lifespan**: Remaining useful life calculations

### 🎯 Smart Recommendations
- **Condition-Based Advice**: Tailored recommendations based on device condition
- **Lifespan Considerations**: Different advice for devices with remaining life
- **Recycling Benefits**: Energy, water, and landfill space savings
- **Local Resources**: Connect to certified e-waste recyclers

## Technology Stack

- **Frontend**: Next.js 14 with TypeScript
- **UI Components**: Shadcn/ui with Tailwind CSS
- **Charts**: Recharts for data visualization
- **AI Integration**: Google AI Studio for enhanced insights
- **Real Data**: EPA, UNEP, and academic research databases

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/ecocycle.git
cd ecocycle
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Impact Calculator Methodology

The impact calculator uses real scientific data from:
- **EPA eGRID Database**: Electricity emissions factors
- **EPA e-waste recycling data**: Material recovery rates
- **UNEP e-waste reports**: Global e-waste statistics
- **Academic studies**: Device lifecycle analysis
- **Industry reports**: Material composition data

### Key Features:
- **Accurate CO2 Calculations**: Manufacturing + usage emissions with age degradation
- **Material Recovery**: Condition and age-based recovery rates
- **Environmental Comparisons**: Real-world equivalents (trees, car miles, etc.)
- **Validation**: Results validated against industry benchmarks (±15% accuracy)

See [Impact Calculator Methodology](docs/impact-calculator-methodology.md) for detailed information.

## Project Structure

```
src/
├── ai/                    # AI flows and prompts
├── app/                   # Next.js app router pages
├── components/            # React components
│   ├── ui/               # Shadcn/ui components
│   ├── impact-calculator.tsx
│   ├── recycling-locator.tsx
│   └── ai-chatbot.tsx
├── lib/                   # Utility libraries
│   ├── impact-calculator.ts  # Real data calculations
│   ├── impact-data.ts        # Scientific data sources
│   └── firebase/            # Firebase configuration
└── hooks/                  # Custom React hooks
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Data Sources

- **EPA eGRID Database**: Electricity emissions factors
- **EPA e-waste recycling data**: Material recovery rates and benefits
- **UNEP e-waste reports**: Global statistics and trends
- **Academic research**: Device lifecycle assessments
- **Industry reports**: Material composition and manufacturing data
- **Energy Star program**: Device energy consumption data

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- EPA for e-waste recycling data and emissions factors
- UNEP for global e-waste statistics
- Academic researchers for lifecycle assessment studies
- Industry partners for material composition data
- Open source community for the amazing tools and libraries

---

**EcoCycle**: Making e-waste management sustainable and accessible for everyone.
