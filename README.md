# NextCal NUS Hack&Roll 2025

## Inspiration
While there are many calendar and activity planning applications available, most of them don't take into account the complex interplay between personality traits, weather conditions, and individual preferences when suggesting activities. Many people struggle to find activities that truly align with their personality  andcurrent circumstances, often leading to unenjoyable experiences or abandoned plans. This inspired us to create NextCal, a smart activity recommender that considers the whole person when making suggestions.


## What it does
NextCal is an intelligent activity recommendation system with a modern web interface that combines AI-powered recommendations (using Google's Gemini LLM), personality psychology, and environmental factors to suggest personalized activities. The system:

- Conducts a comprehensive personality assessment based on the Big Five personality traits (Extraversion, Openness, Conscientiousness, Agreeableness, and Neuroticism)
- Collects additional user preferences including energy levels, preferred times, and social preferences
- Considers real-time weather conditions when making outdoor activity recommendations
- Uses a Large Language Model that weighs multiple factors to suggest activities that truly resonate with the user's personality and circumstances
- Features a full-fledged calendar system with drag-and-drop functionality for easy scheduling
- Integrates with Google OAuth for secure user authentication and profile management
- Allows users to seamlessly add recommended activities to their calendar
- Provides a modern, responsive interface built with React and shadcn/ui components


## How we built it
We developed NextCal using a modern tech stack combining Python backend (FastAPI) with React frontend, implementing a modular architecture that consists of several key components:

1. Personality Assessment Module:
    - Implemented a scientific questionnaire based on the Big Five personality model
    - Created a scoring system that normalizes responses and calculates trait scores
    - Display the result in a spider chart 

2. Activity Recommendation Engine:
    - Designed a weighted scoring algorithm that considers multiple personality factors
    - Implemented weather compatibility checking for outdoor activities

3. Calendar Integration:
    - Implemented a full-featured calendar system with event management
    - Added drag-and-drop functionality for easy event scheduling
    - Created an intuitive interface for managing recommended activities
    - Developed real-time updates for calendar modifications


## Challenges we ran into
1. AI Integration:
    - Fine-tuning Gemini LLM for accurate activity recommendations
    - Optimizing response times for real-time suggestions
    - Ensuring consistent and relevant AI-generated recommendation

2. Personality Scoring Complexity:
    - Ensuring accurate normalization of personality traits
    - Balancing the weights of different factors in the recommendation algorithm
    - Handling edge cases in personality profiles

3. User Interface
    - Implementing a responsive design that works across all devices
    - Creating intuitive drag-and-drop interactions for calendar events
    - Integrating multiple libraries that have conflicting codes, and having to workaround


## Accomplishments that we're proud of
- Developed a modern, responsive frontend using React and Vite
- Successfully integrated Google OAuth for secure authentication
- Built a full-featured calendar system with drag-and-drop functionality
- Created a scientifically-grounded personality assessment system
- Built a flexible and extensible system architecture


## What we learned
- Integration of large language models in recommendation systems
- Insights into the Big Five personality model and its applications
- Algorithm design for multi-factor recommendation systems
- Implementation of OAuth authentication flows
- Advanced calendar management and drag-and-drop interactions


## What's next for NextCal
1. Mobile Application Development:
    - Create native mobile apps for iOS and Android to allow 
    - Implement push notifications for activity recommendations
2. Enhanced AI Integration
    - Expand Gemini LLM capabilities for more nuanced recommendations
    - Implement AI-driven pattern recognition for better activity matching
    - Add conversational interface for activity refinemen
3. Machine Learning Integration
    - Implement learning from user feedback
    - Add support for activity pattern recognition
4. Integration with advanced APIs
    - Advanced APIs such as weather conditions, natural disasters, and events would be integrated with NextCal.
    - Provide information such as the latest news and events happening all over the world. This allows for users to be easily aware of any upcoming events that might have an impact on their lives.
    - AI would be used to help generate methods for those events.
5. Standalone hardware solution
    - It could be a desktop tablet running the software, where users can interact with the calendar seamlessly.