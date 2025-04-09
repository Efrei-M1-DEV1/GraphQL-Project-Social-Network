import { Card, CardBody, CardFooter, CardTitle } from "@repo/ui/data-display/card";
import { Button } from "@repo/ui/form/button";
import { Icon } from "@repo/ui/media/icon";
import { cn } from "@repo/utils/classes";
import { useEffect, useState } from "react";
import { BiErrorCircle } from "react-icons/bi";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else {
      navigate("/");
    }
    return () => {
      clearTimeout(timer);
    };
  }, [countdown, navigate]);

  const goHome = () => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      navigate("/");
    }, 500);
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-xl border-0 bg-white shadow-md dark:bg-gray-950">
        <CardBody className="gap-4 text-center">
          <Icon as={BiErrorCircle} className={cn("mx-auto h-16 w-16 text-red-500", isShaking && "animate-shake")} />
          <CardTitle className="font-extrabold text-4xl text-gray-900 tracking-tight dark:text-white">Lost in Space?</CardTitle>
          <p className="text-lg opacity-60">It seems like you've stumbled upon a black hole. This page doesn't exist!</p>
        </CardBody>
        <CardFooter className="flex-col gap-3">
          <div className="flex flex-col items-center gap-y-3 sm:flex-row sm:justify-center sm:gap-x-4 sm:gap-y-0">
            <Button onClick={goHome} variant="solid" className="bg-gray-950 hover:scale-105 dark:bg-gray-50">
              Warp Back Home
            </Button>
            <Button onClick={goBack} variant="outline" className="text-gray-950 dark:text-gray-50">
              Try to Re-trace Steps
            </Button>
          </div>
          <p className="text-sm opacity-60">
            Auto-navigating to safety in <span className="font-semibold">{countdown}</span> seconds...
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
