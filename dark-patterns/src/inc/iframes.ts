class IFrameContent {
  iFrameContent: { [key: string]: string } = {};

  addIFrameContent(referrer: string, content: string) {
    this.iFrameContent[referrer] = content;
  }

  getIFrameContent(referrer: string) {
    if (this.iFrameContent[referrer] !== undefined) {
      return this.iFrameContent[referrer];
    } else {
      return null;
    }
  }
}

const iFrameContent = new IFrameContent();

export default iFrameContent;
