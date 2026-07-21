import type { SceneComposition, SceneLightingConfig, CameraTransform, DepthLayer, AdaptiveRenderProfile } from "./types.js";
import { SceneCompositor } from "./compositor.js";
import { SafeAreaManager } from "./safe-area.js";
import { AutoFramingEngine, type FramingTarget } from "./auto-framing.js";
import { RuleOfThirdsEngine } from "./rule-of-thirds.js";
import { SubjectTracker } from "./subject-tracker.js";
import { AutoCropEngine } from "./auto-crop.js";
import { DepthMapEngine } from "./depth-map.js";
import { SceneParallaxCompositor } from "./parallax.js";
import { SceneLightingEngine } from "./lighting.js";
import { SceneFocusEngine } from "./focus.js";
import { VisualSafetyEngine } from "./visual-safety.js";
import { FrameCompositor } from "./frame-compositor.js";
import { CinematicCompositionAI } from "./cinematic-composition.js";
import { MultiLayerDepthEngine } from "./multi-depth.js";
import { SmartSceneStabilizer } from "./stabilizer.js";
import { AdaptiveRenderProfileManager } from "./adaptive-profiles.js";
import { SceneValidator } from "./validation.js";

export class SceneRenderer {
  readonly compositor: SceneCompositor;
  readonly safeArea: SafeAreaManager;
  readonly autoFraming: AutoFramingEngine;
  readonly ruleOfThirds: RuleOfThirdsEngine;
  readonly subjectTracker: SubjectTracker;
  readonly autoCrop: AutoCropEngine;
  readonly depthMap: DepthMapEngine;
  readonly parallax: SceneParallaxCompositor;
  readonly lighting: SceneLightingEngine;
  readonly focus: SceneFocusEngine;
  readonly visualSafety: VisualSafetyEngine;
  readonly frameCompositor: FrameCompositor;
  readonly cinematicAI: CinematicCompositionAI;
  readonly multiDepth: MultiLayerDepthEngine;
  readonly stabilizer: SmartSceneStabilizer;
  readonly adaptiveProfiles: AdaptiveRenderProfileManager;
  readonly validator: SceneValidator;

  constructor() {
    this.compositor = new SceneCompositor();
    this.safeArea = new SafeAreaManager();
    this.autoFraming = new AutoFramingEngine();
    this.ruleOfThirds = new RuleOfThirdsEngine();
    this.subjectTracker = new SubjectTracker();
    this.autoCrop = new AutoCropEngine();
    this.depthMap = new DepthMapEngine();
    this.parallax = new SceneParallaxCompositor();
    this.lighting = new SceneLightingEngine();
    this.focus = new SceneFocusEngine();
    this.visualSafety = new VisualSafetyEngine();
    this.frameCompositor = new FrameCompositor();
    this.cinematicAI = new CinematicCompositionAI();
    this.multiDepth = new MultiLayerDepthEngine();
    this.stabilizer = new SmartSceneStabilizer();
    this.adaptiveProfiles = new AdaptiveRenderProfileManager();
    this.validator = new SceneValidator();
  }

  renderScene(
    sceneIndex: number,
    imageAsset: string,
    targets: FramingTarget[],
    camera: CameraTransform,
    profile?: AdaptiveRenderProfile
  ): SceneComposition {
    const activeProfile = profile ?? this.adaptiveProfiles.get("documentary")!;
    const lightingConfig: SceneLightingConfig = this.adaptiveProfiles.getLightingConfig(activeProfile);
    this.lighting.configure(lightingConfig);
    this.safeArea.configure(this.adaptiveProfiles.getSafeAreaBounds(activeProfile));

    const framed = this.autoFraming.frame(targets, 1920, 1080);
    const crop = this.autoCrop.crop(1920, 1080, "16:9", targets[0]);
    const depthLayers: DepthLayer[] = this.depthMap.estimate(imageAsset);
    const layeredMotion = this.parallax.compose(depthLayers, camera, 1920, 1080);

    const composition = this.compositor.compose(sceneIndex, imageAsset, camera, lightingConfig, this.compositor.getLayerRenderer().getLayers(), depthLayers);
    composition.cropping = crop;
    composition.focus = this.focus.determineFocus(targets.map((t) => ({ type: t.type === "character" ? "face" : t.type === "object" ? "object" : "symbol" as const, x: t.x, y: t.y, width: t.width, height: t.height, softenBackground: false }))) ?? composition.focus;

    const score = this.cinematicAI.evaluate(framed.x, framed.y, 1920, 1080, false, false);
    const stability = this.stabilizer.analyze(framed.x, framed.y, camera.zoom, targets[0] ?? { x: 0, y: 0, width: 0, height: 0 }, 1920, 1080);

    return composition;
  }
}
