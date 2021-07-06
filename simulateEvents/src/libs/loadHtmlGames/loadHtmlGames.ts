export class LoadHtmlGames {
  script: any;

  loadHtmlGame = (src: string) => {
    return new Promise((resolve, reject) => {
      this.script = document.createElement("script");
      this.script.src = src;
      this.script.addEventListener("load", () => {
        resolve(this.script);
      });
      this.script.addEventListener("error", (e: any) => {
        reject(e);
      });
      document.body.appendChild(this.script);
    });
  };

  
}
