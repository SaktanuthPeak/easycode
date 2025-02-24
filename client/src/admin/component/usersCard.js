import React from "react";
import { Card, CardHeader, CardBody } from "@material-tailwind/react";
import { Users } from "lucide-react";

export default function UsersCard() {
  return (
    <Card className="w-full">
      <CardHeader
        floated={false}
        shadow={false}
        className="flex flex-row items-center justify-between pb-2"
      >
        <h5 className="text-sm font-medium text-gray-600">Active Users</h5>
        <Users className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardBody className="pt-0">
        <div className="text-2xl font-bold text-gray-900">+2350</div>
        <p className="text-xs text-gray-500">+180.1% from last month</p>
      </CardBody>
    </Card>
  );
}
