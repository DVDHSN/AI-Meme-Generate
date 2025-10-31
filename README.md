# AI Meme Generator 🤖😂

A web application that leverages Google's Gemini Pro Vision model to generate humorous captions for your images, turning them into instant memes.

## 📜 Description

This project is a simple yet powerful AI-powered meme generator. You can upload any image, provide a text prompt to set the context or desired humor, and the application uses the multimodal capabilities of the Google Gemini Pro Vision model to understand the image and generate a witty caption. The entire user interface is built with Streamlit, making it easy to run and use locally.

## ✨ Key Features

-   **Image-to-Text Generation**: Creates meme captions based on the visual content of an image.
-   **Context-Aware**: Uses your text prompt to guide the AI's humor and style.
-   **Multimodal AI**: Powered by the state-of-the-art Google Gemini Pro Vision model.
-   **Interactive UI**: A clean and simple web interface built with Streamlit for easy interaction.
-   **Easy to Use**: Just upload an image, type a prompt, and click a button to generate a meme.

## 🛠️ Tech Stack

-   **Backend**: Python
-   **AI Model**: Google Gemini Pro Vision
-   **Web Framework**: Streamlit
-   **Libraries**:
    -   `google-generativeai`
    -   `Pillow`
    -   `python-dotenv`

## 🚀 Installation & Setup

Follow these steps to get the AI Meme Generator running on your local machine.

### Prerequisites

-   Python 3.8+
-   A Google API Key. You can get one from [Google AI Studio](https://makersuite.google.com/app/apikey).

### Step-by-Step Guide

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/DVDHSN/AI-Meme-Generate.git
    cd AI-Meme-Generate
    ```

2.  **Create a Virtual Environment**
    It's recommended to create a virtual environment to keep dependencies isolated.
    ```bash
    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate

    # For Windows
    python -m venv venv
    venv\Scripts\activate
    ```

3.  **Install Dependencies**
    Install all the required Python packages using the `requirements.txt` file.
    ```bash
    pip install -r requirements.txt
    ```

4.  **Set Up Environment Variables**
    Create a `.env` file in the root directory of the project.
    ```bash
    touch .env
    ```
    Open the `.env` file and add your Google API Key like this:
    ```
    GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY_HERE"
    ```

5.  **Run the Application**
    Start the Streamlit server.
    ```bash
    streamlit run app.py
    ```
    Your web browser should automatically open to the application's URL (usually `http://localhost:8501`).

## usage Usage

Once the application is running, using it is straightforward:

1.  **Enter a Prompt**: In the text box, type a prompt that describes the kind of meme you want to create (e.g., "Make a funny meme about software developers and bugs").
2.  **Upload an Image**: Click the "Choose an image..." button to upload an image file from your computer.
3.  **Generate**: Click the "Generate Meme" button.
4.  **View Result**: The AI-generated caption will appear below the button. Enjoy your new meme!

![Usage GIF](https://raw.githubusercontent.com/DVDHSN/AI-Meme-Generate/main/meme-generator.gif)

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or want to fix a bug, please feel free to contribute.

1.  **Fork the repository** on GitHub.
2.  **Create a new branch**: `git checkout -b feature/your-awesome-feature`
3.  **Make your changes** and commit them: `git commit -m 'Add some awesome feature'`
4.  **Push to the branch**: `git push origin feature/your-awesome-feature`
5.  **Open a Pull Request**.

Please report any bugs or issues by opening an issue on the GitHub repository.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
```
