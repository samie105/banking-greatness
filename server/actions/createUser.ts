"use server";
import dbConnect from "..";
import User, { IUser } from "../userSchema";
import { actionClient } from "@/lib/safeActionClient";
import { signUpSchemaFull } from "../schema";
import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { logout } from "../dashboard/navActions";
import { encrypt, decrypt, sign, unsign } from "@/lib/encription"; // You'll need to implement this

// Function to generate a 10-digit random number
function generateRandomAccountNumber(): string {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}

// Function to generate a unique 10-digit bank account number
async function generateUniqueAccountNumber() {
  let isUnique = false;
  let accountNumber = "";

  while (!isUnique) {
    accountNumber = generateRandomAccountNumber();
    const existingUser = await User.findOne({
      bankAccountNumber: accountNumber,
    });
    if (!existingUser) {
      isUnique = true;
    }
  }

  return accountNumber;
}

// Function to generate a unique 10-digit bank routing number
async function generateUniqueRoutingNumber() {
  let isUnique = false;
  let routingNumber = "";

  while (!isUnique) {
    routingNumber = generateRandomAccountNumber();
    const existingUser = await User.findOne({
      bankRoutingNumber: routingNumber,
    });
    if (!existingUser) {
      isUnique = true;
    }
  }

  return routingNumber;
}

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
  path: "/",
};
const setSecureCookie = async (
  name: string,
  value: string,
  maxAge?: number
) => {
  try {
    const encryptedValue = await encrypt(value);
    const signedValue = await sign(encryptedValue);
    cookies().set(name, signedValue, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: maxAge || 60 * 60, // 1 hour default
    });
  } catch (error) {
    console.error(`Error setting cookie ${name}:`, error);
  }
};

// Function to get and verify a cookie
const getSecureCookie = async (name: string): Promise<string | null> => {
  try {
    const signedValue = cookies().get(name)?.value;
    if (!signedValue) return null;

    const unsignedValue = await unsign(signedValue);
    if (!unsignedValue) return null; // Cookie signature is invalid

    return await decrypt(unsignedValue);
  } catch (error) {
    console.error(`Error getting cookie ${name}:`, error);
    return null;
  }
};

// Default user details
const deets = {
  codeVerification: false,
  paymentVerification: false,
  paymentImageLink: "image link",
  notifications: [
    {
      id: 1,
      message: "Welcome to wilson bank",
      status: "neutral",
      type: "neutral",
      dateAdded: new Date(),
    },
  ],
  readNotification: false,
  card: {
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
    cardBillingAddress: "",
    cardZipCode: "",
  },
  cardBalance: 0,
  accountBalance: 0,
  fixedBalance: 0,
  accountLimit: 5000,
  fixedHistory: [],
  isPaidOpeningDeposit: false,
};

// Action to create a new user
export const createUser = actionClient
  .schema(signUpSchemaFull)
  .action(async ({ parsedInput }) => {
    parsedInput.email = parsedInput.email.toLowerCase();
    const userDeets: IUser = { ...parsedInput, ...deets };

    await dbConnect();

    try {
      // ...

      // Set cookies

      // Generate a unique 10-digit bank account number
      const uniqueAccountNumber = await generateUniqueAccountNumber();
      const uniqueRoutingNumber = await generateUniqueRoutingNumber();
      userDeets.bankAccountNumber = uniqueAccountNumber;
      userDeets.bankRoutingNumber = uniqueRoutingNumber;
      userDeets.accountType = "savings";
      // Create a new user with the parsed input data
      const createdUser: IUser = await User.create(userDeets);
      await setSecureCookie("userEmail", createdUser.email, 4 * 24 * 60 * 60); // 4 days
      await setSecureCookie("verified", "false", 4 * 24 * 60 * 60);
      await setSecureCookie("paid", "false", 4 * 24 * 60 * 60);
      const email = await getSecureCookie("userEmail");
      console.log(email);

      return {
        success: true,
        user: {
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          email: createdUser.email,
          phone: createdUser.phone,
          motherMaidenName: createdUser.motherMaidenName,
          ssn: createdUser.ssn,
          password: createdUser.password,
          bankAccountNumber: createdUser.bankAccountNumber,
          bankRoutingNumber: createdUser.bankRoutingNumber,
        },
      };
    } catch (error) {
      console.error("Error creating user:", error);

      // Return error response
      return {
        success: false,
        error: "Error creating user. Please try again later.",
      };
    }
  });

// Function to fetch user details
export const fetchDetails = async () => {
  const headersList = headers();
  const pathname = headersList.get("x-invoke-path") || "";
  const isAuthPath = pathname.includes("auth");
  if (isAuthPath) return;
  await dbConnect();
  const email = await getSecureCookie("userEmail");
  if (!email) logout();
  const data = await User.findOne({ email });
  if (!data) {
    logout();
    return;
  }
  if (data) {
    const cleanData: IUser = JSON.parse(JSON.stringify(data));
    return { data: cleanData };
  }
  revalidatePath("/");
};
