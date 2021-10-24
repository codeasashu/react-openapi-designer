class BrowserStore {
  constructor(stores) {
    this.stores = stores;
  }

  openUrlInBrowser(url) {
    const width = 500;
    const height = 600;
    const widthRatio = screen.width / window.screen.availWidth;
    const top = (window.outerHeight - height) / 2 / widthRatio + window.screenY;
    const left = (window.outerWidth - width) / 2 / widthRatio + window.screenX;

    return window.open(
      url,
      '_blank',
      `scrollbars=yes, width=${width / widthRatio}, height=${
        height / widthRatio
      }, top=${top}, left=${left}`,
    );
  }
}

export default BrowserStore;
