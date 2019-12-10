import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

// Create an AWS resource (S3 Bucket)
//const bucket = new aws.s3.Bucket("my-bucket");

// Export the name of the bucket
//export const bucketName = bucket.id;
const environment = pulumi.getStack();
console.log(environment);

const readS3Role = new aws.iam.Role("s3bucket-read-user-role", {
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Action: "sts:AssumeRole",
        Principal: {
          Service: "s3.amazonaws.com"
        },
        Effect: "Allow",
        Sid: ""
      }
    ]
  })
});

const readS3RolePolicy = new aws.iam.RolePolicy(
  "s3bucket-read-user-role-policy",
  {
    role: readS3Role,
    policy: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Action: ["s3:ListBucket"],
          Effect: "Allow",
          Resource: "*"
        }
      ]


    })
  }
);

const s3ReadPolicy = new aws.iam.Policy("s3-read-policy", {
  policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Action: ["s3:ListBucket"],
        Effect: "Allow",
        Resource: "*"
      }
    ]
  })
});

const rolePolicyAttachment = new aws.iam.RolePolicyAttachment(
  "s3-rolepolicyattachment",
  {
    role: readS3Role,
    policyArn: s3ReadPolicy.arn
  }
);

const user = new aws.iam.User("myuser");

const group = new aws.iam.Group("mygroup");

const policyAttachment = new aws.iam.PolicyAttachment(
  "s3-read-policyattachment",
  {
    users: [user],
    groups: [group],
    roles: [readS3Role],
    policyArn: s3ReadPolicy.arn
  }
);
