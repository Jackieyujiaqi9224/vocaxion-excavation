// Register only the glTF 2.0 loader and material extensions used by this
// project's GLB assets. Importing @babylonjs/loaders/glTF registers every glTF
// extension and substantially increases the production bundle.
import "@babylonjs/loaders/glTF/glTFFileLoader.js";
import "@babylonjs/loaders/glTF/2.0/glTFLoader.js";
import "@babylonjs/loaders/glTF/2.0/Extensions/KHR_materials_anisotropy.js";
import "@babylonjs/loaders/glTF/2.0/Extensions/KHR_materials_clearcoat.js";
import "@babylonjs/loaders/glTF/2.0/Extensions/KHR_materials_ior.js";
import "@babylonjs/loaders/glTF/2.0/Extensions/KHR_materials_specular.js";
