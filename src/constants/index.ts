import { Clock, Code2, Calendar, Users } from "lucide-react";

export const INTERVIEW_CATEGORY = [
  { id: "upcoming", title: "Upcoming Interviews", variant: "outline" },
  { id: "completed", title: "Completed", variant: "secondary" },
  { id: "succeeded", title: "Succeeded", variant: "default" },
  { id: "failed", title: "Failed", variant: "destructive" },
] as const;

export const TIME_SLOTS = [
  "00:00",
  "00:10",
  "00:20",
  "00:30",
  "00:40",
  "00:50",
  "01:00",
  "01:10",
  "01:20",
  "01:30",
  "01:40",
  "01:50",
  "02:00",
  "02:10",
  "02:20",
  "02:30",
  "02:40",
  "02:50",
  "03:00",
  "03:10",
  "03:20",
  "03:30",
  "03:40",
  "03:50",
  "04:00",
  "04:10",
  "04:20",
  "04:30",
  "04:40",
  "04:50",
  "05:00",
  "05:10",
  "05:20",
  "05:30",
  "05:40",
  "05:50",
  "06:00",
  "06:10",
  "06:20",
  "06:30",
  "06:40",
  "06:50",
  "07:00",
  "07:10",
  "07:20",
  "07:30",
  "07:40",
  "07:50",
  "08:00",
  "08:10",
  "08:20",
  "08:30",
  "08:40",
  "08:50",
  "09:00",
  "09:10",
  "09:20",
  "09:30",
  "09:40",
  "09:50",
  "10:00",
  "10:10",
  "10:20",
  "10:30",
  "10:40",
  "10:50",
  "11:00",
  "11:10",
  "11:20",
  "11:30",
  "11:40",
  "11:50",
  "12:00",
  "12:10",
  "12:20",
  "12:30",
  "12:40",
  "12:50",
  "13:00",
  "13:10",
  "13:20",
  "13:30",
  "13:40",
  "13:50",
  "14:00",
  "14:10",
  "14:20",
  "14:30",
  "14:40",
  "14:50",
  "15:00",
  "15:10",
  "15:20",
  "15:30",
  "15:40",
  "15:50",
  "16:00",
  "16:10",
  "16:20",
  "16:30",
  "16:40",
  "16:50",
  "17:00",
  "17:10",
  "17:20",
  "17:30",
  "17:40",
  "17:50",
  "18:00",
  "18:10",
  "18:20",
  "18:30",
  "18:40",
  "18:50",
  "19:00",
  "19:10",
  "19:20",
  "19:30",
  "19:40",
  "19:50",
  "20:00",
  "20:10",
  "20:20",
  "20:30",
  "20:40",
  "20:50",
  "21:00",
  "21:10",
  "21:20",
  "21:30",
  "21:40",
  "21:50",
  "22:00",
  "22:10",
  "22:20",
  "22:30",
  "22:40",
  "22:50",
  "23:00",
  "23:10",
  "23:20",
  "23:30",
  "23:40",
  "23:50",
];

export const QUICK_ACTIONS = [
  {
    icon: Code2,
    title: "New Call",
    description: "Start an instant call",
    color: "primary",
    gradient: "from-primary/10 via-primary/5 to-transparent",
  },
  {
    icon: Users,
    title: "Join Interview",
    description: "Enter via invitation link",
    color: "purple-500",
    gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
  },
  {
    icon: Calendar,
    title: "Schedule",
    description: "Plan upcoming interviews",
    color: "blue-500",
    gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
  },
  {
    icon: Clock,
    title: "Recordings",
    description: "Access past interviews",
    color: "orange-500",
    gradient: "from-orange-500/10 via-orange-500/5 to-transparent",
  },
];

export const CODING_QUESTIONS: CodeQuestion[] = [
  // Existing questions here...
  {
    id: "two-sum",
    title: "Two Sum",
    description:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers in the array such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your solution here
  
}`,
      python: `def two_sum(nums, target):
    # Write your solution here
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
    }
}`,
    },
    constraints: [
      "2 ≤ nums.length ≤ 104",
      "-109 ≤ nums[i] ≤ 109",
      "-109 ≤ target ≤ 109",
      "Only one valid answer exists.",
    ],
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    description:
      "Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.",
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
      },
    ],
    starterCode: {
      javascript: `function reverseString(s) {
  // Write your solution here
  
}`,
      python: `def reverse_string(s):
    # Write your solution here
    pass`,
      java: `class Solution {
    public void reverseString(char[] s) {
        // Write your solution here
        
    }
}`,
    },
  },
  {
    id: "palindrome-number",
    title: "Palindrome Number",
    description:
      "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.\n\nAn integer is a palindrome when it reads the same forward and backward.",
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation:
          "121 reads as 121 from left to right and from right to left.",
      },
      {
        input: "x = -121",
        output: "false",
        explanation:
          "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.",
      },
    ],
    starterCode: {
      javascript: `function isPalindrome(x) {
  // Write your solution here
  
}`,
      python: `def is_palindrome(x):
    # Write your solution here
    pass`,
      java: `class Solution {
    public boolean isPalindrome(int x) {
        // Write your solution here
        
    }
}`,
    },
  },
  {
    id: "fibonacci-number",
    title: "Fibonacci Number",
    description:
      "Given an integer `n`, return the `n`th Fibonacci number.\n\nThe Fibonacci sequence is defined as:\n- F(0) = 0, F(1) = 1\n- F(n) = F(n - 1) + F(n - 2) for n > 1",
    examples: [
      {
        input: "n = 2",
        output: "1",
      },
      {
        input: "n = 5",
        output: "5",
      },
    ],
    starterCode: {
      javascript: `function fibonacci(n) {
  // Write your solution here
  
}`,
      python: `def fibonacci(n):
    # Write your solution here
    pass`,
      java: `class Solution {
    public int fibonacci(int n) {
        // Write your solution here
    }
}`,
    },
    constraints: ["0 ≤ n ≤ 30"],
  },
  {
    id: "merge-sorted-arrays",
    title: "Merge Sorted Arrays",
    description:
      "Given two sorted integer arrays `nums1` and `nums2`, merge `nums2` into `nums1` as one sorted array.",
    examples: [
      {
        input: "nums1 = [1,2,3,0,0,0], nums2 = [2,5,6]",
        output: "[1,2,2,3,5,6]",
      },
    ],
    starterCode: {
      javascript: `function mergeSortedArrays(nums1, nums2) {
  // Write your solution here
  
}`,
      python: `def merge_sorted_arrays(nums1, nums2):
    # Write your solution here
    pass`,
      java: `class Solution {
    public void mergeSortedArrays(int[] nums1, int[] nums2) {
        // Write your solution here
    }
}`,
    },
    constraints: [
      "0 ≤ nums1.length, nums2.length ≤ 200",
      "-109 ≤ nums1[i], nums2[i] ≤ 109",
    ],
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    description:
      "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets are closed by the same type of brackets.\n2. Open brackets are closed in the correct order.",
    examples: [
      {
        input: 's = "()"',
        output: "true",
      },
      {
        input: 's = "([)]"',
        output: "false",
      },
    ],
    starterCode: {
      javascript: `function isValid(s) {
  // Write your solution here
  
}`,
      python: `def is_valid(s):
    # Write your solution here
    pass`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your solution here
    }
}`,
    },
    constraints: ["1 ≤ s.length ≤ 104", "s consists of parentheses only."],
  },
  {
    id: "longest-common-prefix",
    title: "Longest Common Prefix",
    description:
      'Write a function to find the longest common prefix string amongst an array of strings.\n\nIf there is no common prefix, return an empty string `""`.',
    examples: [
      {
        input: 'strs = ["flower","flow","flight"]',
        output: '"fl"',
      },
      {
        input: 'strs = ["dog","racecar","car"]',
        output: '""',
      },
    ],
    starterCode: {
      javascript: `function longestCommonPrefix(strs) {
  // Write your solution here
  
}`,
      python: `def longest_common_prefix(strs):
    # Write your solution here
    pass`,
      java: `class Solution {
    public String longestCommonPrefix(String[] strs) {
        // Write your solution here
    }
}`,
    },
    constraints: [
      "0 ≤ strs.length ≤ 200",
      "0 ≤ strs[i].length ≤ 200",
      "strs[i] consists of lowercase English letters only.",
    ],
  },
];

export const LANGUAGES = [
  { id: "javascript", name: "JavaScript", icon: "/javascript.png" },
  { id: "python", name: "Python", icon: "/python.png" },
  { id: "java", name: "Java", icon: "/java.png" },
] as const;

export interface CodeQuestion {
  id: string;
  title: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  starterCode: {
    javascript: string;
    python: string;
    java: string;
  };
  constraints?: string[];
}

export type QuickActionType = (typeof QUICK_ACTIONS)[number];
