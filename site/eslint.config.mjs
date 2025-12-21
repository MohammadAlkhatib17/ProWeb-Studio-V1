// @ts-check
import eslint from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
    // Base ESLint recommended rules
    eslint.configs.recommended,

    // TypeScript ESLint recommended rules
    ...tseslint.configs.recommended,

    // Next.js plugin rules
    {
        plugins: {
            '@next/next': nextPlugin,
        },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs['core-web-vitals'].rules,
        },
    },

    // React plugin configuration
    {
        plugins: {
            'react': reactPlugin,
            'react-hooks': reactHooksPlugin,
        },
        rules: {
            ...reactPlugin.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off', // Not needed in Next.js
            'react/prop-types': 'off', // Using TypeScript
            // Allow React Three Fiber custom JSX properties
            'react/no-unknown-property': ['error', {
                ignore: [
                    // R3F common props
                    'attach', 'args', 'object', 'position', 'rotation', 'scale',
                    'intensity', 'castShadow', 'receiveShadow', 'color', 'fog',
                    'near', 'far', 'fov', 'aspect', 'frustumCulled', 'visible',
                    'dispose', 'onUpdate', 'geometry', 'material', 'skeleton',
                    'morphTargetInfluences', 'morphTargetDictionary',
                    // Material props
                    'vertexColors', 'transparent', 'opacity', 'side', 'blending',
                    'depthTest', 'depthWrite', 'wireframe', 'flatShading',
                    'roughness', 'metalness', 'emissive', 'emissiveIntensity',
                    'envMapIntensity', 'clearcoat', 'clearcoatRoughness', 'map',
                    // Light props
                    'distance', 'decay', 'penumbra', 'angle', 'target',
                    'shadow-mapSize', 'shadow-mapSize-width', 'shadow-mapSize-height',
                    'shadow-camera-near', 'shadow-camera-far', 'shadow-bias',
                    // Shader props
                    'uniforms', 'vertexShader', 'fragmentShader',
                    // Points/Particles
                    'count', 'itemSize', 'array', 'sizeAttenuation',
                    // Custom uniforms & misc
                    'time', 'resolution', 'mouse', 'needsUpdate', 'usage',
                    // MeshTransmissionMaterial props (drei)
                    'transmission', 'thickness', 'ior', 'distortion', 'distortionScale',
                    'temporalDistortion', 'chromaticAberration', 'anisotropy',
                    'attenuationColor', 'attenuationDistance', 'samples', 'backside',
                    // styled-jsx props
                    'jsx', 'global',
                ]
            }],
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },

    // React Hooks rules - separate config to avoid conflicts
    {
        plugins: {
            'react-hooks': reactHooksPlugin,
        },
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
    },

    // Custom rule overrides
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': ['warn', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
            }],
            '@next/next/no-sync-scripts': 'warn',
            'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
        },
    },

    // Three.js files: Relax rules that conflict with 3D rendering patterns
    {
        files: ['**/three/**/*.tsx', '**/three/**/*.ts', '**/3d/**/*.tsx', '**/components/**/Scene*.tsx'],
        rules: {
            // R3F uses imperative mutations in useFrame which is idiomatic
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },

    // Ignore patterns
    {
        ignores: [
            '.next/**',
            'node_modules/**',
            'public/**',
            '**/*.d.ts',
            'scripts/**',
            'docs/**',
            '*.config.js',
            '*.config.mjs',
            '*.config.ts',
        ],
    },
];

export default eslintConfig;
