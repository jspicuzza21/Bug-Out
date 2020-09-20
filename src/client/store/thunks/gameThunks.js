/* eslint-disable no-shadow */
/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import {
  getCurrentGame,
  getPrompt,
  setPowerups,
  setCorrectAnswer,
  addScoreAction,
  startGame,
  updateName,
  updateGame,
} from '../actions';

export const createGameThunk = (rounds, difficulty, history) => (dispatch) => axios
  .post('/game/createGame', { rounds, difficulty })
  .then(({ data }) => {
    console.log('data', data)
    const gameSessionId = data.id;
    axios.put(`/game/player/${gameSessionId}`)
      .then(({ data }) => {
        dispatch(updateGame(data));
        history.push(`/game/${data.id}`);
      })
      .catch((e) => {
        console.log(e);
      });
  })
  .catch((e) => {
    console.log(e);
  });

export const joinGameThunk = (code) => (dispatch) => axios.put(`/game/addplayer/${code}`, { code })
  .then(({ data }) => {
    dispatch(updateGame(data));
  })
  .catch((e) => {
    console.log(e);
  });

export const getCurrentGameThunk = (id) => (dispatch) => axios.get(`/game/current/${id}`)
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

export const getPromptThunk = (difficulty) => (dispatch) => axios
  .get(`/game/prompt/${difficulty}`)
  .then(({ data }) => {
    console.log('prompt:', data);
    dispatch(getPrompt(data));
  })
  .catch((e) => {
    console.log(e);
  });

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
  dispatch(addScoreAction(score));
};

export const startGameThunk = (currentGameId) => (dispatch) => axios
  .put('/game/startGame', { currentGameId })
  .then((res) => {
    console.log('response from server on StartGameThunk is ', res);
    dispatch(startGame(res.data));
  })
  .catch((e) => {
    console.log(e);
  });
