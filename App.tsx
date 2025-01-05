import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import AuthForm from "./components/AuthForm";
import { auth } from "./Firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import PayoutCalculator from "./components/PayoutCalculator";  // Import PayoutCalculator Component

interface Article {
  title: string;
  description: string;
  author: string | null;
  publishedAt: string;
  url: string;
  urlToImage: string | null;
  isDeleted?: boolean;
}

const sportsList = [
  { name: "Football", value: "football", image: "/images/football.jpg" },
  { name: "Basketball", value: "basketball", image: "/images/basketball.jpeg" },
  { name: "Cricket", value: "cricket", image: "/images/cricket.jpg" },
  { name: "UFC", value: "ufc", image: "/images/ufc.jpg" },
  { name: "Tennis", value: "tennis", image: "/images/tennis.jpg" },
  { name: "Formula One", value: "formula one", image: "/images/f1.jpg" },
];

const App: React.FC = () => {
  const [selectedSport, setSelectedSport] = useState<string>("football");
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [user, setUser] = useState<any>(null); // Tracks the authenticated user

  // Firebase Authentication Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update user state
    });
    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Log out the user
      alert("You have successfully logged out.");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const fetchNews = async (sport: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("https://newsapi.org/v2/everything", {
        params: {
          q: sport,
          sortBy: "publishedAt",
          language: "en",
// if api limit reach
// then use this api
 // ad25262e6b154cd492ac7a4d66ec564f
          apiKey: "7463054e475f4eaf8999ba89c5647fad",
        },
      });
      const enrichedArticles = response.data.articles.map((article: Article, index: number) => ({
        ...article,
        isDeleted: index % 5 === 0, // Simulate some articles being deleted
      }));
      setNews(enrichedArticles);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to fetch news. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(selectedSport);
  }, [selectedSport]);

  const handleExport = () => {
    const filteredNews = news.filter((article) => !article.isDeleted);
    const csvData = filteredNews
      .map((article) => `${article.title},${article.author},${article.publishedAt},${article.url}`)
      .join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${selectedSport}_news.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filteredNews = news.filter(
    (article) =>
      !article.isDeleted &&
      (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.description && article.description.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    focusOnSelect: true,
    afterChange: (index: number) => {
      setSelectedSport(sportsList[index % sportsList.length].value);
    },
  };

  // Render the AuthForm if the user is not logged in
  if (!user) {
    return (
      <div className="App">
        <header className="dashboard-header">
          <div className="dashboard-title">
            <h1>Sports Dunia</h1>
            <p>Please login to access the sports news!</p>
          </div>
        </header>
        <main>
          <AuthForm />
        </main>
      </div>
    );
  }

  // Render the sports news and PayoutCalculator if the user is logged in
  return (
    <div className="App">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>Sports Dunia</h1>
          <p>Your go-to hub for sports news and updates!</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      <main>
        <div className="slider-container">
          <Slider {...sliderSettings}>
            {sportsList.map((sport) => (
              <div
                key={sport.value}
                className={`slider-item ${selectedSport === sport.value ? "active" : ""}`}
              >
                <img src={sport.image} alt={sport.name} className="sport-image" />
                <p className="sport-name">{sport.name}</p>
              </div>
            ))}
          </Slider>
        </div>

        <div className="filters-container">
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={handleExport} className="export-button">
            Export News
          </button>
        </div>

        {loading && <p>Loading {selectedSport} news...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && filteredNews.length > 0 && (
          <div className="news-container">
            {filteredNews.map((article, index) => (
              <div key={index} className="news-card">
                {article.urlToImage && (
                  <img src={article.urlToImage} alt={article.title} className="news-image" />
                )}
                <h2>{article.title}</h2>
                <p>
                  <strong>Author:</strong> {article.author || "Unknown"}
                </p>
                <p>{article.description}</p>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  Read More
                </a>
              </div>
            ))}
          </div>
        )}
        {!loading && filteredNews.length === 0 && (
          <p>No news available for {selectedSport} at the moment.</p>
        )}

        {/* Payout Calculator */}
        <PayoutCalculator />  {/* Render the PayoutCalculator component */}
      </main>
    </div>
  );
};

export default App;
