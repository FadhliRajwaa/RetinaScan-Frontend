import { useCallback, useState, useEffect } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { motion } from "framer-motion";

const ParticlesBackground = ({ 
  preset = "default",
  customOptions = {},
  className = ""
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const particlesInit = useCallback(async (engine) => {
    try {
      await loadFull(engine);
      setIsLoaded(true);
    } catch (error) {
      console.error("Error initializing particles:", error);
      setHasError(true);
    }
  }, []);

  const getPresetOptions = () => {
    const presets = {
      default: {
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: "#3b82f6"
          },
          shape: {
            type: "circle",
            stroke: {
              width: 0,
              color: "#000000"
            },
            polygon: {
              nb_sides: 5
            }
          },
          opacity: {
            value: 0.5,
            random: false,
            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: false,
              speed: 40,
              size_min: 0.1,
              sync: false
            }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#3b82f6",
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "grab"
            },
            onclick: {
              enable: true,
              mode: "push"
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 140,
              line_linked: {
                opacity: 1
              }
            },
            bubble: {
              distance: 400,
              size: 40,
              duration: 2,
              opacity: 8,
              speed: 3
            },
            repulse: {
              distance: 200,
              duration: 0.4
            },
            push: {
              particles_nb: 4
            },
            remove: {
              particles_nb: 2
            }
          }
        },
        retina_detect: true,
        background: {
          color: "#111827",
          image: "",
          position: "50% 50%",
          repeat: "no-repeat",
          size: "cover"
        }
      },
      
      bubbles: {
        particles: {
          number: {
            value: 30,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: ["#8b5cf6", "#3b82f6", "#10B981"]
          },
          shape: {
            type: "circle"
          },
          opacity: {
            value: 0.8,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 10,
            random: true,
            anim: {
              enable: true,
              speed: 2,
              size_min: 3,
              sync: false
            }
          },
          line_linked: {
            enable: false
          },
          move: {
            enable: true,
            speed: 1,
            direction: "top",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "bubble"
            },
            onclick: {
              enable: true,
              mode: "repulse"
            },
            resize: true
          },
          modes: {
            bubble: {
              distance: 250,
              size: 15,
              duration: 2,
              opacity: 0.8,
              speed: 3
            },
            repulse: {
              distance: 200,
              duration: 0.4
            }
          }
        },
        retina_detect: true
      },
      
      snow: {
        particles: {
          number: {
            value: 100,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: "#ffffff"
          },
          shape: {
            type: "circle",
          },
          opacity: {
            value: 0.8,
            random: true,
            anim: {
              enable: false,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 4,
            random: true,
            anim: {
              enable: false,
              speed: 40,
              size_min: 0.1,
              sync: false
            }
          },
          line_linked: {
            enable: false
          },
          move: {
            enable: true,
            speed: 2,
            direction: "bottom",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "bubble"
            },
            onclick: {
              enable: true,
              mode: "repulse"
            },
            resize: true
          },
          modes: {
            bubble: {
              distance: 200,
              size: 6,
              duration: 2,
              opacity: 0.8,
              speed: 3
            },
            repulse: {
              distance: 200,
              duration: 0.4
            }
          }
        },
        retina_detect: true
      },
      
      stars: {
        particles: {
          number: {
            value: 100,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: "#ffffff"
          },
          shape: {
            type: "star",
            stroke: {
              width: 0,
              color: "#000000"
            },
            polygon: {
              nb_sides: 5
            }
          },
          opacity: {
            value: 0.7,
            random: true,
            anim: {
              enable: true,
              speed: 0.5,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 5,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              size_min: 0.1,
              sync: false
            }
          },
          line_linked: {
            enable: false
          },
          move: {
            enable: true,
            speed: 0.5,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "bubble"
            },
            onclick: {
              enable: true,
              mode: "push"
            },
            resize: true
          },
          modes: {
            bubble: {
              distance: 200,
              size: 7,
              duration: 2,
              opacity: 0.8,
              speed: 3
            },
            push: {
              particles_nb: 4
            }
          }
        },
        retina_detect: true
      },
      
      fireflies: {
        particles: {
          number: {
            value: 40,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: "#ffff00"
          },
          shape: {
            type: "circle"
          },
          opacity: {
            value: 0.8,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 4,
            random: true,
            anim: {
              enable: true,
              speed: 2,
              size_min: 1,
              sync: false
            }
          },
          line_linked: {
            enable: false
          },
          move: {
            enable: true,
            speed: 2,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
              enable: false,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "bubble"
            },
            onclick: {
              enable: true,
              mode: "repulse"
            },
            resize: true
          },
          modes: {
            bubble: {
              distance: 200,
              size: 6,
              duration: 2,
              opacity: 0.8,
              speed: 3
            },
            repulse: {
              distance: 200,
              duration: 0.4
            }
          }
        },
        retina_detect: true
      }
    };

    return presets[preset] || presets.default;
  };

  const options = {
    ...getPresetOptions(),
    ...customOptions,
  };

  // Fallback CSS classes berdasarkan preset
  const fallbackClasses = {
    default: "bg-gradient-to-br from-gray-900 to-blue-900",
    stars: "bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800",
    bubbles: "bg-gradient-to-br from-blue-50 via-blue-100 to-white",
    fireflies: "bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
  };

  return (
    <div className={`absolute inset-0 -z-10 ${className} ${hasError ? fallbackClasses[preset] : ''}`}>
      {!hasError && (
        <Particles
          id={`particles-${preset}`}
          init={particlesInit}
          options={options}
          className="absolute inset-0"
        />
      )}

      {/* Fallback animation jika particles gagal dimuat */}
      {hasError && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute -inset-[10%] rounded-full opacity-20 blur-3xl bg-blue-500"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
              rotate: [0, 90]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.div 
            className="absolute -inset-[20%] rounded-full opacity-20 blur-3xl bg-purple-500"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.1, 0.2, 0.1],
              rotate: [0, -90]
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          />
          <motion.div 
            className="absolute -inset-[15%] rounded-full opacity-15 blur-3xl bg-indigo-500"
            animate={{ 
              scale: [0.8, 1, 0.8],
              opacity: [0.1, 0.15, 0.1],
              rotate: [0, 45]
            }}
            transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", delay: 2 }}
          />
        </div>
      )}
    </div>
  );
};

export default ParticlesBackground; 