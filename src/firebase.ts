import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  setDoc, 
  enableIndexedDbPersistence, 
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { STEPPING_TILES_REVIEWS } from './data';
import { Booking } from './types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with custom databaseId
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Enable offline persistence gracefully for smoother client experience when connection is down or firestore backend is unreachable
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence failed-precondition (multiple tabs open)');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence is unimplemented in this browser');
    } else {
      console.warn('Firestore persistence error:', err);
    }
  });
}

// Validate Connection to Firestore on startup
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Successfully connected to Cloud Firestore backend.');
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    if (errMsg.toLowerCase().includes('offline') || errMsg.toLowerCase().includes('unavailable') || errMsg.toLowerCase().includes('failed to get')) {
      console.warn('Firestore is running in offline/unreachable mode. Please check your Firebase configuration or internet connection.');
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helper to determine if an error is security/permission related
function isPermissionError(err: unknown): boolean {
  const errMsg = err instanceof Error ? err.message : String(err);
  const code = (err as any)?.code;
  return (
    code === 'permission-denied' || 
    errMsg.toLowerCase().includes('permission') || 
    errMsg.toLowerCase().includes('insufficient')
  );
}

/**
 * Seed initial reviews from local data.ts if the Firestore reviews collection is empty
 */
export async function seedReviewsIfEmpty() {
  try {
    const reviewsRef = collection(db, 'reviews');
    const snapshot = await getDocs(reviewsRef);
    if (snapshot.empty) {
      console.log('Seeding initial reviews into Firestore...');
      for (const review of STEPPING_TILES_REVIEWS) {
        // Use setDoc with custom ID to avoid duplicates
        await setDoc(doc(db, 'reviews', review.id), {
          ...review,
          createdAt: new Date().toISOString()
        });
      }
      console.log('Successfully seeded reviews into Firestore!');
    }
  } catch (err) {
    if (isPermissionError(err)) {
      handleFirestoreError(err, OperationType.WRITE, 'reviews');
    } else {
      console.warn('Firestore is unreachable or offline (seed skipped):', err);
    }
  }
}

/**
 * Fetch all reviews from Firestore
 */
export async function fetchReviewsFromFirestore() {
  try {
    const reviewsRef = collection(db, 'reviews');
    const snapshot = await getDocs(reviewsRef);
    const reviewsList: any[] = [];
    snapshot.forEach((doc) => {
      reviewsList.push({ id: doc.id, ...doc.data() });
    });
    return reviewsList.length > 0 ? reviewsList : STEPPING_TILES_REVIEWS;
  } catch (err) {
    if (isPermissionError(err)) {
      handleFirestoreError(err, OperationType.GET, 'reviews');
    } else {
      console.warn('Firestore is unreachable (offline mode fallback):', err);
    }
    return STEPPING_TILES_REVIEWS;
  }
}

/**
 * Add a new customer review to Firestore
 */
export async function addReviewToFirestore(review: {
  userName: string;
  rating: number;
  text: string;
  serviceName: string;
  source: string;
  image?: string;
}) {
  try {
    const reviewsRef = collection(db, 'reviews');
    const docRef = await addDoc(reviewsRef, {
      ...review,
      date: 'Just now',
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...review, date: 'Just now' };
  } catch (err) {
    if (isPermissionError(err)) {
      handleFirestoreError(err, OperationType.CREATE, 'reviews');
    } else {
      console.warn('Firestore write failed, using offline mock fallback:', err);
      return { id: `temp-review-${Date.now()}`, ...review, date: 'Just now' };
    }
    throw err;
  }
}

/**
 * Save a booking to Firestore
 */
export async function saveBookingToFirestore(booking: Booking) {
  try {
    await setDoc(doc(db, 'bookings', booking.id), {
      ...booking,
      createdAt: booking.createdAt || new Date().toISOString()
    });
    console.log('Successfully saved booking to Firestore:', booking.id);
  } catch (err) {
    if (isPermissionError(err)) {
      handleFirestoreError(err, OperationType.WRITE, `bookings/${booking.id}`);
    } else {
      console.warn('Firestore write failed, booking will remain in offline mode:', err);
    }
  }
}

/**
 * Get all bookings from Firestore
 */
export async function getBookingsFromFirestore(): Promise<Booking[]> {
  try {
    const bookingsRef = collection(db, 'bookings');
    const snapshot = await getDocs(bookingsRef);
    const bookings: Booking[] = [];
    snapshot.forEach((doc) => {
      bookings.push(doc.data() as Booking);
    });
    return bookings;
  } catch (err) {
    if (isPermissionError(err)) {
      handleFirestoreError(err, OperationType.GET, 'bookings');
    } else {
      console.warn('Firestore is unreachable (offline bookings load skipped):', err);
    }
    return [];
  }
}
