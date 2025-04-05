import { Button } from "@repo/ui/form/button";
import { Container } from "@repo/ui/layout/container";
import { Icon } from "@repo/ui/media/icon";
import { Heading } from "@repo/ui/typography/heading";
import { useEffect, useState } from "react";
import { BiErrorCircle } from "react-icons/bi";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(20);
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else {
      navigate("/");
    }
    return () => clearTimeout(timer);
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
    <Container className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50">
      <div className="rounded-2xl bg-white p-8 text-center shadow-xl">
        <Icon as={BiErrorCircle} className={`mx-auto h-16 w-16 text-red-500 ${isShaking ? "animate-shake" : ""}`} />
        <Heading className="mt-4 font-extrabold text-4xl text-gray-900 tracking-tight">Lost in Space?</Heading>
        <div className="mt-3 text-gray-500 text-lg">
          It seems like you've stumbled upon a black hole. This page doesn't exist!
        </div>
        <div className="mt-8 flex flex-col items-center space-y-3 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
          <Button onClick={goHome} variant="solid" className="hover:scale-105">
            Warp Back Home
          </Button>
          <Button onClick={goBack} variant="outline">
            Try to Re-trace Steps
          </Button>
        </div>
        <div className="mt-6 text-gray-500 text-sm">
          Auto-navigating to safety in <span className="font-semibold">{countdown}</span> seconds...
        </div>
      </div>
    </Container>
  );
}
