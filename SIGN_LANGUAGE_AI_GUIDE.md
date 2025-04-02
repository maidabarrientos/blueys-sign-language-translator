# OpenAI-Powered Sign Language Interpreter

This application uses OpenAI's Vision API to provide real-time sign language interpretation. Instead of mock data, it now sends images of your hand signs to OpenAI's powerful vision model for actual interpretation.

## How It Works

1. **Hand Detection**: The app first uses TensorFlow.js and the HandPose model to detect hands in the video feed.

2. **Image Capture**: When hands are detected, the app captures a high-quality image frame from your webcam.

3. **AI Interpretation**: The image is sent to OpenAI's GPT-4o model, which has powerful vision capabilities.

4. **Result Display**: The interpreted sign is displayed on the screen in real-time.

## Tips for Best Results

- **Good Lighting**: Ensure your hands are well-lit for better detection.
- **Clear Background**: Try to have a plain background to make your hands stand out.
- **Complete Signs**: Make full, clear signs rather than partial gestures.
- **Centered Position**: Keep your hands centered in the camera frame.
- **Patience**: The API calls happen every 2 seconds to avoid excessive usage.

## Technical Details

- Uses OpenAI's GPT-4o model (formerly gpt-4-vision-preview)
- High-quality image capture with 95% JPEG quality
- Error handling with graceful fallbacks
- Debounced API calls (once every 2 seconds)

## Limitations

- OpenAI Vision API requires an internet connection
- Limited to signs that OpenAI's model has been trained to recognize
- Minor latency due to API call timing
- API usage quotas may apply

## Customization

You can customize the behavior by modifying:

- The API call frequency (currently 2000ms)
- The image quality (currently 0.95)
- The prompt sent to OpenAI

## Troubleshooting

If you encounter issues:

1. **No Detection**: Check your camera permissions and lighting.
2. **Strange Interpretations**: Try making clearer signs or repositioning.
3. **API Errors**: Verify your OpenAI API key is correctly configured.
4. **Console Errors**: Check the browser console for specific error messages.

For API key setup, make sure you have a valid OpenAI API key in your `.env.local` file:

```
OPENAI_API_KEY=your-actual-api-key
``` 