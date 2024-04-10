import ora, { Ora } from "ora";

let spinner:Ora;
export function startLoading() {
  spinner = ora("正在回答中，请稍等\r").start();
}

export function stopLoading() {
  spinner.stop();
}
