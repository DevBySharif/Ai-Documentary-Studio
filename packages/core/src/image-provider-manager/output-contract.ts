import { IPProviderName, IPOutputContract } from "./types";

export class IPOutputContractBuilder {
  private provider: IPProviderName = "flux";
  private style: string = "standard";
  private resolution: string = "1024x1024";
  private validated: boolean = false;
  private status: "pending" | "approved" | "rejected" | "flagged" = "pending";

  setProvider(provider: IPProviderName): IPOutputContractBuilder {
    this.provider = provider;
    return this;
  }

  setStyle(style: string): IPOutputContractBuilder {
    this.style = style;
    return this;
  }

  setResolution(resolution: string): IPOutputContractBuilder {
    this.resolution = resolution;
    return this;
  }

  setValidated(validated: boolean): IPOutputContractBuilder {
    this.validated = validated;
    return this;
  }

  setStatus(status: "pending" | "approved" | "rejected" | "flagged"): IPOutputContractBuilder {
    this.status = status;
    return this;
  }

  build(): IPOutputContract {
    return {
      provider: this.provider,
      style: this.style,
      resolution: this.resolution,
      validated: this.validated,
      status: this.status,
    };
  }

  fromImageResult(
    provider: IPProviderName,
    resolution: string,
    validated: boolean
  ): IPOutputContract {
    return {
      provider,
      style: "standard",
      resolution,
      validated,
      status: validated ? "approved" : "flagged",
    };
  }
}
