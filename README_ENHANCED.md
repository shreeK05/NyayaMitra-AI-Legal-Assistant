# NyayaMitra - Professional AI Legal Assistant for India

**Version 2.0.0** - Enhanced Edition with Grok API & Advanced Legal Analysis

## 🏛️ Overview

NyayaMitra is a professional AI-powered legal assistant specifically designed for the Indian legal system. It leverages the power of Grok API to provide comprehensive legal analysis, applicable laws, case law references, and professional legal notice drafting—all available in English, Hindi, and Marathi.

### Key Features

✨ **AI-Powered Legal Analysis** - Powered by Grok API (llama-3.3-70b-versatile)
📋 **Comprehensive Analysis** - Case laws, applicable statutes, action steps, and pros/cons
📄 **Legal Notice Generation** - Professional draft notices ready for customization
📸 **Document Analysis** - Upload and analyze legal documents
🌐 **Multilingual Support** - English, Hindi, and Marathi translations
🔊 **Audio Support** - Listen to analysis in multiple languages
📱 **Responsive Design** - Works seamlessly on all devices
🎨 **Professional UI** - Modern, intuitive interface built with React & Tailwind CSS

## 🚀 What's New in v2.0.0

### Major Enhancements

1. **Grok API Integration**
   - Replaced Google Gemini with Grok API for superior legal analysis
   - Uses `llama-3.3-70b-versatile` model
   - Better context understanding for Indian legal scenarios

2. **Advanced Legal Response Structure**
   - **Case Law References** - With court, year, and relevance percentage
   - **Applicable Statutes** - Specific sections and penalties
   - **Action Steps** - Prioritized with urgency levels (HIGH/MEDIUM/LOW)
   - **Pros & Cons Analysis** - Advantages and risks clearly outlined
   - **Confidence Score** - Transparency in analysis accuracy
   - **Disclaimers** - Comprehensive legal disclaimers included

3. **Enhanced Components**
   - **AnalysisTabs** - Multiple tabs for analysis, laws, case law, and action steps
   - **LegalNotice** - Professional notice template with download/print options
   - **Improved UI** - Better visual hierarchy and professional styling

4. **Professional Styling**
   - Gradient backgrounds and modern shadows
   - Enhanced color scheme with better contrast
   - Improved accessibility and user experience
   - Quick example queries for easier navigation

## 📋 Project Structure

```
├── App.tsx                 # Main application component
├── index.tsx              # React entry point
├── index.html             # HTML template
├── types.ts               # TypeScript interfaces
├── vite-env.d.ts          # Vite environment types
├── components/
│   ├── AnalysisTabs.tsx   # Multi-tab analysis viewer
│   ├── LegalNotice.tsx    # Legal notice template
│   └── VoicePlayer.tsx    # Audio playback component
├── services/
│   └── geminiService.ts   # Grok API service (renamed from gemini)
├── package.json           # Dependencies & scripts
├── vite.config.ts         # Vite configuration
└── tsconfig.json          # TypeScript configuration
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Grok API Key (get from xai.com)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nyayamitra
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:5173/`

5. **Build for production**
   ```bash
   npm run build
   ```

## 📦 Dependencies

### Core
- **React 19** - UI framework
- **Vite 6** - Build tool
- **TypeScript 5.7** - Type safety
- **Tailwind CSS 3.4** - Styling

### Development
- **Autoprefixer** - CSS vendor prefixing
- **PostCSS** - CSS processing

## 🎯 API Integration

### Grok API Configuration

The service uses the Groq API with the following configuration:

```typescript
- Model: llama-3.3-70b-versatile
- Temperature: 0.3 (for consistent, professional responses)
- Response Format: JSON
- Max Tokens: 4096
```

### Response Structure

The API returns a comprehensive legal analysis with:

```typescript
{
  englishAnalysis: string;        // Full analysis in English
  hindiAnalysis: string;          // Full analysis in Hindi
  marathiAnalysis: string;        // Full analysis in Marathi
  suggestedAction: string;        // Immediate recommended action
  caseLaws: CaseLaw[];            // Relevant court cases
  applicableStatutes: Statute[];  // Applicable laws and sections
  actionSteps: ActionStep[];      // Prioritized next steps
  prosCons: {
    pros: string[];
    cons: string[];
  };
  draftNoticeEN/HI/MR: string;    // Legal notice templates
  analysisConfidence: number;     // 70-95 confidence score
  disclaimers: string[];          // Legal disclaimers
  nextSteps: string;              // Professional next steps
}
```

## 🎨 UI/UX Improvements

### Enhanced Features

1. **Tab-Based Analysis**
   - Overview, Applicable Laws, Case Law, Action Steps tabs
   - Each tab with specific formatting and icons

2. **Professional Legal Notice**
   - Copy to clipboard functionality
   - Download as text file
   - Print to PDF support
   - Expandable content for long notices

3. **Quick Examples**
   - Pre-populated example queries
   - One-click loading for common scenarios

4. **Results Display**
   - Suggested immediate action with next steps
   - Confidence level indicator
   - Important information section with disclaimers
   - Consultation history for reference

5. **Error Handling**
   - Professional error messages
   - Recovery suggestions
   - Retry mechanisms

## 🌐 Multilingual Support

The application provides full support for:
- **English (EN)** - Complete legal analysis
- **हिंदी (HI)** - Hindi translation
- **मराठी (MR)** - Marathi translation

All analyses are generated in all three languages automatically.

## 📱 Responsive Design

- Mobile-first approach
- Tablet optimization
- Desktop-optimized layout
- Touch-friendly interfaces

## 🔐 Security & Privacy

- No data persistence on server
- Secure API key management via environment variables
- No tracking or analytics
- HTTPS recommended for production
- Compliant with data privacy standards

## ⚠️ Important Disclaimers

This tool provides AI-generated analysis and is NOT a substitute for professional legal advice. 

**Always:**
- Consult with a qualified lawyer for formal proceedings
- Verify all information before taking action
- Customize generated notices to your specific situation
- Check applicable limitation periods
- Review with legal professionals before sending notices

## 🚀 Development Features

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### TypeScript Support

- Full type safety with TypeScript 5.7
- Proper environment variable types
- React component type checking
- Strict mode enabled

### Code Quality

- ESLint-ready setup
- Tailwind CSS for consistent styling
- Vite for optimized builds
- Component-based architecture

## 📊 Component Breakdown

### App.tsx
- Main application logic
- State management for queries, history, and results
- Form submission and error handling
- Results rendering

### AnalysisTabs.tsx
- Multi-tab interface for different analysis aspects
- Case law display with relevance scores
- Statute references with penalties
- Action steps with urgency indicators
- Pros and cons analysis

### LegalNotice.tsx
- Professional notice template
- Language switching
- Copy, download, and print functionality
- Disclaimer section
- Professional footer with metadata

### Services/geminiService.ts
- Grok API integration
- Prompt engineering for Indian legal context
- Response parsing and validation
- Error handling and logging

## 🎯 Use Cases

1. **Tenant Rights** - Eviction notices, security deposits
2. **Employment Issues** - Leave, salary, contract disputes
3. **Property Disputes** - Boundary issues, inheritance
4. **Consumer Protection** - Product defects, unfair practices
5. **Contract Disputes** - Breach of contract, amendments
6. **Consumer Cases** - Warranty, refund issues

## 🤝 Contributing

For improvements and bug fixes:
1. Test thoroughly with Grok API
2. Ensure multilingual support
3. Maintain professional tone
4. Add appropriate disclaimers
5. Update documentation

## 📝 License

Professional use license for Indian legal context

## 📞 Support

For issues or questions:
- Review the UI tooltips
- Check example queries
- Consult legal professionals
- Review error messages for guidance

## 🔮 Future Enhancements

- [ ] Case law database integration
- [ ] Real-time statute updates
- [ ] Video consultation integration
- [ ] Multi-document analysis
- [ ] Advanced filtering and search
- [ ] Professional dashboard
- [ ] Analytics and reporting

---

**NyayaMitra v2.0** - Your Professional AI Legal Assistant for India
*Making justice accessible, affordable, and available to all*
