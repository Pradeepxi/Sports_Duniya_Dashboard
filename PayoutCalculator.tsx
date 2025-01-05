import React, { useState, useEffect } from "react";

interface Article {
  id: number;
  title: string;
  author: string;
  type: string; // "news" or "blog"
}

const sampleArticles: Article[] = [
  { id: 1, title: "Football Stars", author: "John Doe", type: "news" },
  { id: 2, title: "Cricket World Cup", author: "Jane Smith", type: "blog" },
  { id: 3, title: "Formula 1 Highlights", author: "Mark Lee", type: "news" },
  { id: 4, title: "Tennis Legends", author: "Emily Brown", type: "blog" },
];

const PayoutCalculator: React.FC = () => {
  const [payoutPerArticle, setPayoutPerArticle] = useState<number>(0);
  const [articles, setArticles] = useState<Article[]>(sampleArticles);
  const [totalPayout, setTotalPayout] = useState<number>(0);

  useEffect(() => {
    // Retrieve payout from localStorage if it exists
    const storedPayout = localStorage.getItem("payoutPerArticle");
    if (storedPayout) {
      setPayoutPerArticle(Number(storedPayout));
    }

    // Calculate total payout
    const calculatedPayout = articles.reduce((total, article) => {
      return total + (payoutPerArticle || 0);
    }, 0);
    setTotalPayout(calculatedPayout);
  }, [payoutPerArticle, articles]);

  const handlePayoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const payout = Number(e.target.value);
    setPayoutPerArticle(payout);
    // Save payout in localStorage
    localStorage.setItem("payoutPerArticle", payout.toString());
  };

  return (
    <div className="payout-calculator-container">
      <div className="payout-settings">
        <label>
          Payout per Article/Blog:
          <input
            type="number"
            value={payoutPerArticle}
            onChange={handlePayoutChange}
            placeholder="Enter payout rate"
            className="payout-input"
          />
        </label>
      </div>

      {/* Payout Details Table */}
      <div className="payout-details-table">
        <h3>Payout Details</h3>
        <table>
          <thead>
            <tr>
              <th>Author</th>
              <th>Article Title</th>
              <th>Article Type</th>
              <th>Payout</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td>{article.author}</td>
                <td>{article.title}</td>
                <td>{article.type}</td>
                <td>{payoutPerArticle}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="total-payout">
          <strong>Total Payout: ${totalPayout}</strong>
        </div>
      </div>
    </div>
  );
};

export default PayoutCalculator;
