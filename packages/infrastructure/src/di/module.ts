import { ContainerContract, ContainerModuleContract } from "./types";

export abstract class BaseContainerModule implements ContainerModuleContract {
  constructor(public readonly name: string) {}

  public abstract register(container: ContainerContract): void;
}
