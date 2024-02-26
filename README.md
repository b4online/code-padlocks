# Code Padlocks

We need the possibility to configure a secret key (as much digits as possible), which is used to generate valid codes upon unlocking.

The lock should accept the input from the user and once received should generate all possible codes (monthly, bi-weekly, weekly, daily, etc.), which are currently valid and should compare the entered code against those. If one of the codes matches, the lock should open and the user should be informed about the validity of the entered code.
