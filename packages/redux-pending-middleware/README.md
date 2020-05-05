# Redux Pending Middleware

A redux [middleware](https://redux.js.org/advanced/middleware) which tracks your asynchronous [redux](http://redux.js.org) actions (effects) and informs about the progress through selector function.

<br/>

List of supported libraries that process redux effects:

- [redux-toolkit](https://github.com/reduxjs/redux-toolkit)
- [redux-thunk](https://github.com/reduxjs/redux-thunk)
- [redux-saga](https://github.com/redux-saga/redux-saga)
- [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware)

It's worth mention that `redux-pending-middleware` allows you to code simultaneously with all the above libraries simultaneously.

<br/>

## Quick start

```shell script
npm install redux-pending-middleware
```

Depending on what you use in the project, import into the project. Now let's dwell on this in more detail.

### [redux-toolkit](https://github.com/reduxjs/redux-toolkit)

This approach is simplest and clear

```javascript
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { reduxPendingToolkitMiddleware } from 'redux-pending-middleware';
import { rootReducer as reducer } from './root.reducer';

const defaultMiddlewares = getDefaultMiddleware();
const middleware = [reduxPendingToolkitMiddleware, ...defaultMiddlewares];

export const store = configureStore({ reducer, middleware });
```

### [redux-thunk](https://github.com/reduxjs/redux-thunk)

Under development

### [redux-saga](https://github.com/redux-saga/redux-saga)

This approach is that you need to wrap the saga worker.
This allows to track the start and end of the effect.

```javascript
import { trackWorker } from 'redux-pending-middleware';
import { call, put, takeEvery } from '@redux-saga/core/effects';

function* getPlanets() {
  yield takeEvery(getPlanetsRequest.type, trackWorker(handleGetPlanets));
}

function* handleGetPlanets() {
  const planets = yield call(Api.getPlanets);
  yield put(getPlanetsCompleted(planets));
}
```

This approach successfully combined with custom wrappers on top of the worker, for example, error handling.

```javascript
const workerWrapper = worker => {
  return trackWorker(customWrapper);

  function* customWrapper(...args) {
    try {
      yield* worker(...args);
    } catch (error) {
      yield put(setFetchError(error));
    }
  }
};
```

### [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware)

At the moment, `redux-pending-middleware` completely replaces `redux-promise-middleware`.
In the plans, through the collaboration, expand the API of `redux-promise-middleware` in order to reuse their code.

```javascript
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { reduxPendingPromiseMiddleware } from 'redux-pending-middleware';
import { rootReducer as reducer } from './root.reducer';

const defaultMiddlewares = getDefaultMiddleware();
const middleware = [reduxPendingPromiseMiddleware, ...defaultMiddlewares];

export const store = configureStore({ reducer, middleware });
```

### Connecting the dots

For everything to work at the same time, you need to use all the previous steps

```javascript
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import {
  reduxPendingPromiseMiddleware,
  reduxPendingToolkitMiddleware,
  trackWorker
} from 'redux-pending-middleware';
import createSagaMiddleware from '@redux-saga/core';
import { call, put, takeEvery } from '@redux-saga/core/effects';
import { rootReducer as reducer } from './root.reducer';
import { rootSaga } from './root.saga';

const defaultMiddlewares = getDefaultMiddleware();
const sagaMiddleware = createSagaMiddleware();
const middleware = [
  reduxPendingPromiseMiddleware,
  reduxPendingToolkitMiddleware,
  sagaMiddleware,
  ...defaultMiddlewares
];

export const store = configureStore({ reducer, middleware });

sagaMiddleware.run(rootSaga);

/**
 * somewhere in the /src
 * saga usage example with trackWorker
 */
function* getPlanets() {
  yield takeEvery(getPlanetsRequest.type, trackWorker(handleGetPlanets));
}

function* handleGetPlanets() {
  const planets = yield call(Api.getPlanets);
  yield put(getPlanetsCompleted(planets));
}
```

<br/>

### Contacts

Please reach me out if you have any questions or comments.

- [GitHub](https://github.com/maktarsis)
- [Twitter](https://twitter.com/maktarsis)

### License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.

<br/>

### Contributing

Contributions are welcome. For major changes, please open an issue first to discuss what you would like to change.

If you made a PR, make sure to update tests as appropriate and keep the examples consistent.

<br/>
