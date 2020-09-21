/* eslint-disable no-shadow */
/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import moment from 'moment';

import {
  getCurrentGame,
  getPrompt,
  setPowerups,
  setCorrectAnswer,
  addScoreAction,
  startGame,
  updateName,
  updateGame,
  updateCode,
  setGameTimes,
} from '../actions';

export const createGameThunk = (rounds, difficulty) => (dispatch) => axios
  .post('/game/createGame', { rounds, difficulty })
  .then(({ data }) => {
    // console.log('data', data);
    const gameSessionId = data.id;
    axios.put('/game/player', { gameSessionId })
      .then(({ data }) => {
        dispatch(updateGame(data));
      })
      .catch((e) => {
        console.log(e);
      });
  })
  .catch((e) => {
    console.log(e);
  });

export const updateGameCodeThunk = (code) => (dispatch) => axios
  .put('/game/newGameCode', { code })
  .then(({ data }) => {
    dispatch(updateCode(data));
  })
  .catch((e) => {
    console.log('failed to update code', e);
  });

export const updateGameThunk = (rounds, difficulty) => (dispatch) => {
  console.log(rounds);
  return axios
    .post('/game/updateGame', { rounds, difficulty })
    .then((game) => {
      dispatch(updateGame(game.data));
    })
    .catch((e) => {
      console.log(e);
    });
};

export const joinGameThunk = (code) => (dispatch) => axios.put('/game/addplayer', { code })
  .then(({ data }) => {
    dispatch(updateGame(data));
  })
  .catch((e) => {
    dispatch(updateGame('failed'));
    console.log(e);
  });

export const getCurrentGameThunk = () => (dispatch) => axios.get('/game/current')
  .then(({ data }) => {
    dispatch(getCurrentGame(data));
  })
  .catch((e) => {
    console.log(e);
  });

export const findRandomGameThunk = (currentGameId) => (dispatch) => axios
  .post('/game/findRandomGame', { currentGameId })
  .then(({ data }) => {
    dispatch(data);
  })
  .catch((e) => {
    console.log(e);
  });

export const getPromptThunk = (difficulty) => (dispatch) => {
  console.log('getPromptsThunk difficulty:', difficulty);
  return axios
    .get(`/game/prompt/${difficulty}`)
    .then(({ data }) => {
      console.log('prompt:', data);
      dispatch(getPrompt(data));
    })
    .catch((e) => {
      console.log(e);
    });
};

export const getPowerUpsThunk = () => (dispatch) => axios
  .get('/game/powerups')
  .then(({ data }) => {
    dispatch(setPowerups(data));
  })
  .catch((e) => {
    console.log(e);
  });

export const updateNameThunk = (name) => (dispatch) => axios
  .put('/session/updateName', { name })
  .then((res) => {
    dispatch(updateName(res.data));
  })
  .catch((e) => {
    console.log(e);
  });

export const setCorrect = () => (dispatch) => {
  dispatch(setCorrectAnswer());
};

export const addScore = (score) => (dispatch) => {
  axios.put('/session/score', { score })
    .then(() => {
      dispatch(addScoreAction(score));
    });
};

export const setRoundTimes = (id) => (dispatch) => {
  const year = moment().year();
  const month = moment().month();
  const day = moment().date();
  let hour = moment().hour();
  const minute = moment().minute();
  const seconds = moment().seconds();

  let newMin = minute + 10;
  if (newMin > 59) {
    hour += 1;
    newMin -= 60;
  }

  const roundStart = `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
  const roundEnd = `${year}-${month + 1}-${day} ${hour}:${newMin}:${seconds}`;
  console.log(roundStart, roundEnd);
  axios.put(`/game/game-times/${id}`, { roundStart, roundEnd })
    .then(() => {
      dispatch(setGameTimes(roundStart, roundEnd));
    });
};

export const startGameThunk = (currentGameId) => (dispatch) => axios
  .put('/game/startGame', { currentGameId })
  .then((res) => {
    dispatch(startGame(res.data));
  })
  .catch((e) => {
    console.log(e);
  });
