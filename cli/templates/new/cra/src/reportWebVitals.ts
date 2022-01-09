import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals')
      .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);

        // eslint-disable-next-line sonarjs/no-redundant-jump
        return;
      })
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .catch(() => {});
  }
};

export default reportWebVitals;
