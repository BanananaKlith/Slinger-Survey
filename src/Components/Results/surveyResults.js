import './surveyResults.css'

export default function SurveyResults({results}) {
 // Check if results is not null before trying to map over it
 if (!results) {
    return <div>Loading...</div>;
 }

 return (
    <div style={{padding:"2em"}}>
      <table className='resultsTable' >
        <thead>
          <tr className="resultsTableTr">
            <th>Title:</th>
            <th>Results:</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, i) => (
            <tr className="resultsTableTr" key={i}>
              <td className="resultsTableTr">{result.title}</td>
              <td>
                {result.questions.map((question, j) => (
                  <div className="resultsTableTr" key={j}>
                    <strong>Q{j+1}:</strong> {question.question}
                    <ul>
                      {question.answers.map((answer, k) => (
                              <li key={k}><strong>A{k+1}:</strong>{answer}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
 );
}
