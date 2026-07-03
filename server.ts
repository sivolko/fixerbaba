import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily to protect against missing keys on standard startups
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    console.warn('GEMINI_API_KEY not specifically set. AI Assistant diagnostics will operate on a smart rule-based local backup.');
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Gadget service list to match against
const SUPPORTED_SERVICES = [
  'iphone-screen',
  'iphone-battery',
  'iphone-charge',
  'iphone-camera',
  'android-screen',
  'android-battery',
  'macbook-screen',
  'macbook-battery',
  'macbook-keyboard',
  'ipad-screen',
  'ipad-battery',
  'watch-screen',
  'watch-battery',
  'diagnostic-pack'
];

// Smart Backup Rules
function matchLocalBackupDiagnostic(problem: string) {
  const term = problem.toLowerCase();
  
  if (term.includes('iphone') || term.includes('screen') || term.includes('display') || term.includes('glass') || term.includes('green line') || term.includes('touch') || term.includes('digitizer')) {
    const isBattery = term.includes('battery') || term.includes('charging') || term.includes('power');
    const isMac = term.includes('mac') || term.includes('laptop') || term.includes('keyboard');
    const isWatch = term.includes('watch') || term.includes('smartwatch');
    const isPad = term.includes('ipad') || term.includes('tablet');

    if (isMac) {
      if (isBattery) {
        return {
          problemType: 'MacBook Power & Battery Warning',
          severity: 'high',
          estimatedCost: '₹4,999',
          suggestedServiceIds: ['macbook-battery'],
          advice: [
            'Avoid intensive heavy rendering workflows to prevent overheating.',
            'Keep your MacBook resting on flat surface to help heat escape.',
            'Keep charger disconnected if shell starts swelling.'
          ],
          diagnosisExplanation: 'Your description hints at a heavily degraded lithium battery core. Swollen batteries put internal pressure on the trackpad and requires professional relief to prevent physical damage.'
        };
      }
      return {
        problemType: 'MacBook Hardware Assembly Issue',
        severity: 'high',
        estimatedCost: '₹2,999 - ₹12,999',
        suggestedServiceIds: ['macbook-screen'],
        advice: [
          'Do not apply force on the hinge or the outer metal frame.',
          'Back up your documents to iCloud or external storage if possible.'
        ],
        diagnosisExplanation: 'Stage lighting effects, colored pixel vertical bars or unresponsive trackpads are usually triggered by flexible cable tears inside the display assembly or under the metal casing.'
      };
    }

    if (isWatch) {
      return {
        problemType: 'Smartwatch Screen Fracture',
        severity: 'medium',
        estimatedCost: '₹3,199',
        suggestedServiceIds: ['watch-screen'],
        advice: [
          'Keep away from water or humid areas immediately as water sealing is now broken.',
          'Place clear optical adhesive tape over cracked glass to avoid cutting your skin.'
        ],
        diagnosisExplanation: 'Impact shocks generate microscopic fractures in outer ion-X or sapphire shields. The underlying OLED matrix might remain fully intact and can be saved with pristine glass-only refurbished bonds.'
      };
    }

    if (isPad) {
      return {
        problemType: 'iPad Digitizer Shock Injury',
        severity: 'medium',
        estimatedCost: '₹2,899',
        suggestedServiceIds: ['ipad-screen'],
        advice: [
          'Keep your Apple Pencil stored separately to prevent stylus tip scratches.',
          'Do not flex or bend the outer structural chassis.'
        ],
        diagnosisExplanation: 'A hairline fracture on the outer glass interrupts the multi-touch static charge layer, leading to erratic phantom clicks or dead zones.'
      };
    }

    if (term.includes('iphone')) {
      if (isBattery) {
        return {
          problemType: 'iPhone Battery Ageing Decay',
          severity: 'medium',
          estimatedCost: '₹1,899',
          suggestedServiceIds: ['iphone-battery'],
          advice: [
            'Enable Low Power Mode in settings to stretch remaining capacity.',
            'Do not leave your iPhone charging overnight on soft bedding.',
            'Avoid exposure to extreme direct sunlight.'
          ],
          diagnosisExplanation: 'With wear, lithium batteries experience internal resistance build-up, altering power output and causing systematic lag and sudden power cuts.'
        };
      }
      return {
        problemType: 'iPhone Screen Glass Shatter',
        severity: 'high',
        estimatedCost: '₹3,499',
        suggestedServiceIds: ['iphone-screen'],
        advice: [
          'Keep the display area clean and dry.',
          'Avoid pressure on the TrueTone / FaceID sensor notch array.'
        ],
        diagnosisExplanation: 'A high refresh rate OLED structure is susceptible to deep fractures. TrueTone and FaceID sensors need complete serialization remapping to remain active on replacement screens.'
      };
    }

    return {
      problemType: 'Smartphone Screen Glass Fracture',
      severity: 'high',
      estimatedCost: '₹2,499',
      suggestedServiceIds: ['android-screen'],
      advice: [
        'Avoid contact with moisture to prevent corroding sub-pixel contacts.',
        'Consider backing up stored local files immediately.'
      ],
      diagnosisExplanation: 'Direct impact has shattered the mineral glass layers. Standard optical clear adhesive restoration needs deep UV light curing to guarantee tight structural tolerances.'
    };
  }

  if (term.includes('battery') || term.includes('charge') || term.includes('power') || term.includes('heat') || term.includes('bloat') || term.includes('swoll')) {
    const isMac = term.includes('mac') || term.includes('macbook') || term.includes('laptop');
    const isWatch = term.includes('watch') || term.includes('smartwatch');
    const isPad = term.includes('ipad') || term.includes('tablet');

    if (isMac) {
      return {
        problemType: 'MacBook Power Delivery Anomaly',
        severity: 'high',
        estimatedCost: '₹4,999',
        suggestedServiceIds: ['macbook-battery'],
        advice: [
          'SMC and NVRAM values should be kept clear.',
          'Only use original Power Delivery adapters.'
        ],
        diagnosisExplanation: 'Excessive thermal logs and low backup levels indicate cell wear. A replacement restores thermal security and processor clock limits.'
      };
    }
    if (isWatch) {
      return {
        problemType: 'Smartwatch Power Wearout',
        severity: 'medium',
        estimatedCost: '₹1,499',
        suggestedServiceIds: ['watch-battery'],
        advice: [
          'Disable Always-On display to conserve energy.',
          'Do not charge with unauthorized high-amperage fast chargers.'
        ],
        diagnosisExplanation: 'Wearable batteries use tiny cells which degrade quicker because of daily charging frequency.'
      };
    }
    if (isPad) {
      return {
        problemType: 'iPad Heavy Cycle Aging',
        severity: 'medium',
        estimatedCost: '₹2,499',
        suggestedServiceIds: ['ipad-battery'],
        advice: [
          'Avoid playing games while charging.',
          'Only connect to official Apple chargers to avoid power IC spikes.'
        ],
        diagnosisExplanation: 'iPad large batteries suffer extreme thermal stress during long charging cycles, culminating in slow capacity decline.'
      };
    }

    return {
      problemType: 'iPhone Battery Capacity Degradation',
      severity: 'medium',
      estimatedCost: '₹1,899',
      suggestedServiceIds: ['iphone-battery'],
      advice: [
        'Turn on Optimized Battery Charging in Settings.',
        'Avoid intensive task loops when health is below 80%.'
      ],
      diagnosisExplanation: 'Your lithium battery has surpassed healthy cycle thresholds. The core system board forces throttle profiles to safeguard integrity.'
    };
  }

  // Backup fallback is the Ultimate diagnostics package
  return {
    problemType: 'Comprehensive Device Health Audit',
    severity: 'low',
    estimatedCost: '₹499',
    suggestedServiceIds: ['diagnostic-pack'],
    advice: [
      'Write down exact software bug codes or crash cycles you experience.',
      'Maintain an iCloud or Google backup of all critical records before handoff.'
    ],
    diagnosisExplanation: 'For complex problems, we recommend our signature 21-Point Digital Audit. We run professional hardware loop audits, battery health cycle tests, power IC current reviews, and deep clean debris from audio ports.'
  };
}

// REST API for AI Diagnostic Partner
app.post('/api/diagnose', async (req, res) => {
  try {
    const { problem } = req.body;
    if (!problem || typeof problem !== 'string' || problem.trim() === '') {
      return res.status(400).json({ error: 'Please describe your query or problem.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return smart rule-based offline diagnostics
      const diagnostic = matchLocalBackupDiagnostic(problem);
      return res.json(diagnostic);
    }

    const prompt = `
      You are Baba, the senior diagnostic engineer for "FixerBaba", Bengaluru's premium gadget repair applet.
      A customer has described a gadget repair issue: "${problem}".

      Your job is to diagnose the issue, estimate severity, suggest actionable immediate safety advice, estimate the typical cost bracket, and match it to one or more of our standard device service inventory IDs:
      Standard Service Inventory IDs to recommend:
      - "iphone-screen" (iPhone Pro Screen Replacement - green line, crack, touch dead)
      - "iphone-battery" (iPhone Pro Battery Replacement - health warning, fast drain, system shut)
      - "iphone-charge" (iPhone Lightning / USB-C Port Fix - loose cable, slow charging)
      - "iphone-camera" (iPhone Camera Lens & Sensor Swap - OIS rattle, blurry portrait, glass crack)
      - "android-screen" (Android screen repair & replacement - Samsung, OnePlus screen break)
      - "android-battery" (Android Power Battery Swap - bloating back, hot charging)
      - "macbook-screen" (MacBook Retina Display Assembly - pixel lines, display black, backlight stage dim)
      - "macbook-battery" (MacBook Premium Battery Service - service recommended, sudden turnoff, swollen)
      - "macbook-keyboard" (MacBook Key Mechanisms & Trackpad Fix - keyboard stuck, no trackpad click)
      - "ipad-screen" (iPad Multi-Touch Digitizer Repair - broken front glass)
      - "ipad-battery" (iPad High-Capacity Battery Swap - iPad shuts off at 15%)
      - "watch-screen" (Smartwatch Retina Glass Refurbishing - Apple Watch screen break)
      - "watch-battery" (Smartwatch Li-Ion Battery Swap - Apple watch battery dying quick)
      - "diagnostic-pack" (Ultimate Full Device Diagnosis - slow speeds, diagnostic test needed, ports dusty)

      Ensure suggestedServiceIds contains ONLY valid entries from this list. Return your analysis in the proposed JSON schema. Keep advice actionable and friendly.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            problemType: {
              type: Type.STRING,
              description: 'Precise name of the diagnosed fault (e.g., iPhone Screen Glass Shatter)'
            },
            severity: {
              type: Type.STRING,
              enum: ['low', 'medium', 'high', 'critical']
            },
            estimatedCost: {
              type: Type.STRING,
              description: 'Typical cost range in Indian Rupees (e.g., ₹1,899 - ₹3,499)'
            },
            suggestedServiceIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of matching internal service IDs'
            },
            advice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of 2-3 immediate safety or debugging tips for the user'
            },
            diagnosisExplanation: {
              type: Type.STRING,
              description: 'Friendly, easy to understand explanation of why this happens'
            }
          },
          required: [
            'problemType',
            'severity',
            'estimatedCost',
            'suggestedServiceIds',
            'advice',
            'diagnosisExplanation'
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from model');
    }

    const diagnosis = JSON.parse(text.trim());
    
    // Filter and sanitize suggestedServiceIds to guarantee they match actual product catalogs
    if (Array.isArray(diagnosis.suggestedServiceIds)) {
      diagnosis.suggestedServiceIds = diagnosis.suggestedServiceIds.filter((id: string) => 
        SUPPORTED_SERVICES.includes(id)
      );
    }
    if (!diagnosis.suggestedServiceIds || diagnosis.suggestedServiceIds.length === 0) {
      diagnosis.suggestedServiceIds = ['diagnostic-pack'];
    }

    return res.json(diagnosis);
  } catch (err: any) {
    console.error('Gemini error, turning back to local rule matching:', err);
    // Silent recovery to maintain extreme robust user-friendliness
    const backup = matchLocalBackupDiagnostic(req.body.problem || '');
    return res.json(backup);
  }
});

// Configure Vite or production handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.use(express.static(process.cwd()));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
