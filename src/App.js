import React, { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import "./styles.css";
import gql from "graphql-tag";

const HIREFLIX_API_KEY = "";

const client = new ApolloClient({
  uri: "https://api.hireflix.com/me",
  cache: new InMemoryCache(),
  headers: {
    "X-API-KEY": HIREFLIX_API_KEY
  }
});

const GET_VIDEO_QUERY = gql`
  {
    positions {
      name
      interviews {
        status
        candidate {
          name
        }
        questions {
          title
          description
          answer {
            url
            thumbnail
          }
        }
      }
    }
  }
`;

const App = () => {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    if (HIREFLIX_API_KEY.length) {
      client
        .query({
          query: GET_VIDEO_QUERY,
          fetchPolicy: "no-cache"
        })
        .then((data) => {
          const { positions } = data.data;
          setPositions(positions);
        });
    }
  }, []);

  if (!HIREFLIX_API_KEY.length) {
    return (
      <h1>
        Please go to https://admin.hireflix.com/my-account/api-keys, create an
        API key and paste it above on HIREFLIX_API_KEY variable
      </h1>
    );
  }

  return (
    <div className="App">
      {positions.map((position) => {
        return (
          <>
            <h1>{position.name} position</h1>
            <h2>Interviews</h2>
            {position.interviews.map((interview) => {
              return (
                <>
                  <h3>Candidate name: {interview.candidate.name}</h3>
                  <h3>Status: {interview.status}</h3>
                  <h3>Questions</h3>
                  {interview.questions.map((question) => {
                    if (question.answer) {
                      return (
                        <div>
                          <h4>{question.title}</h4>
                          <h4>{question.description}</h4>
                          <video role="application" controls>
                            <source
                              src={question.answer.url}
                              type="video/mp4"
                            />
                          </video>
                        </div>
                      );
                    }
                  })}
                </>
              );
            })}
          </>
        );
      })}
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
};

export default App;
