# Bluey's ASL/FSL Translator

![Bluey's ASL/FSL Translator Logo](/public/logo.png)

## 🌟 Overview

Bluey's ASL/FSL Translator is an innovative web application designed to bridge communication gaps between sign language users and non-signers. It supports both American Sign Language (ASL) and Filipino Sign Language (FSL), making it a versatile tool for diverse communities.

## 🚀 Features

- Real-time sign language translation
- Text-to-sign language translation
- Support for both ASL and FSL
- User-friendly mobile interface
- Powered by advanced AI
- Secure admin panel for resource management

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Authentication**: JSON Web Tokens (JWT)
- **API**: Next.js API Routes
- **AI Integration**: TensorFlow.js, OpenAI GPT-3.5 Turbo
- **Deployment**: Vercel

## 📦 Installation

1. Clone the repository:
   \`\`\`
   git clone https://github.com/yourusername/blueys-asl-fsl-translator.git
   \`\`\`

2. Navigate to the project directory:
   \`\`\`
   cd blueys-asl-fsl-translator
   \`\`\`

3. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

4. Set up environment variables:
   Create a \`.env.local\` file in the root directory and add the following:
   \`\`\`
   JWT_SECRET=your_jwt_secret_here
   OPENAI_API_KEY=your_openai_api_key_here
   \`\`\`

5. Run the development server:
   \`\`\`
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🖥️ Usage

### For Users
1. Select your preferred sign language (ASL or FSL).
2. Choose between camera mode or text mode.
3. For camera mode, record your signs and get real-time translations.
4. For text mode, enter text to translate into sign language.

### For Admins
1. Navigate to the admin panel at \`/admin\`.
2. Log in using the secure admin password.
3. Add new sign language resources (images or videos) for AI training.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- WLASL Dataset by Dongxu Li and Hongdong Li for providing comprehensive ASL training data
- OpenAI for providing the GPT-3.5 Turbo model
- TensorFlow.js team for their excellent machine learning library
- The deaf and hard of hearing community for their invaluable input and support

## 📚 Datasets Used

### WLASL Dataset
The World Level American Sign Language (WLASL) dataset is used for training our ASL recognition model. It contains 12k processed videos of Word-Level American Sign Language glossary performance. This dataset is intended for academic and computational use only.

- Source: [WLASL Dataset on Kaggle](https://www.kaggle.com/datasets/risangbaskoro/wlasl-processed)
- License: Computational Use of Data Agreement (C-UDA)
- Citation: Li, D., Rodriguez, C., Yu, X., & Li, H. (2020). Word-level Deep Sign Language Recognition from Video: A New Large-scale Dataset and Methods Comparison. In Proceedings of the IEEE/CVF Winter Conference on Applications of Computer Vision (pp. 1459-1469).

