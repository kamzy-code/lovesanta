import _ from "lodash";
import { encodeURI, decode } from "js-base64";

export const getRandomNode = <T>(arr: T[]): T | undefined => {
  return _.sample(arr);
};

/* ----------------------------------------------------------------- */
/* A set of utilities to build URL params to handle accessing the   */
/* authenticated /dip/ page for user pairs, using base65           */
/* -------------------------------------------------------------- */
export const buildAuthPageParams = (obj: Record<string, any>) => {
  const objToString = JSON.stringify(obj);
  const authToURI = encodeURI(objToString);

  console.log(authToURI, "[helpers]:buildAuthPageParams ");
  return authToURI;
};

export const parseAuthPageParams = (param: string) => {
  const authToURI = decode(param);
  const strToObject = JSON.parse(authToURI);

  console.log(authToURI, strToObject, "[helpers]:parseAuthPageParams ");
  return strToObject;
};

/**
 * @function calculateDaysAgo
 * @param date
 */
export const calculateDaysAgo = (date: string | Date): string => {
  const eventDate = typeof date === "string" ? new Date(date) : date;
  const today = new Date();

  if (eventDate > today) {
    const daysToGo = Math.ceil(
      (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    
    if (daysToGo >= 365) {
      const yearsToGo = Math.floor(daysToGo / 365);
      return `${yearsToGo} year${yearsToGo > 1 ? 's' : ''} to go`;
    }
    
    if (daysToGo > 30) {
      const monthsToGo = Math.floor(daysToGo / 30);
      return `${monthsToGo} month${monthsToGo > 1 ? 's' : ''} to go`;
    }
    
    return `${daysToGo} days to go`;
  }
  
  const diffTime = Math.abs(today.getTime() - eventDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  
  if (diffDays >= 365) {
    const years = Math.floor(diffDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
  
  if (diffDays > 30) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  
  return `${diffDays} days ago`;
};

/**
 * @function formatDateToString
 * @param date
 */
export const formatDateToString = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
