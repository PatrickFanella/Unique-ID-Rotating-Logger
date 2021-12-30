# Unique ID, Rotating, Logger

express.js, node.js, morgan, uuid, rotating-file-system

creates a directory logs/ and a file access.log.  After a specified time it compresses access.log with gzip and stores it, keeping only a specified number.
