import axios, { Axios } from 'axios';
import { axiosAdapter } from '../../src/adapters/axios';
import * as focaAxios from 'foca-axios';

// 原生axios
{
  axiosAdapter(axios);
  axiosAdapter(axios.create());
  axiosAdapter(new Axios({}));
}

// foca-axios
{
  axiosAdapter(focaAxios.axios);
  axiosAdapter(focaAxios.default);
  axiosAdapter(focaAxios.axios.create());
}
