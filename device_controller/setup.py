from setuptools import setup, find_packages

setup(
    name="device-controller",
    version="0.1",
    description="Hotel Device Controller Daemon",
    author="Niraj Kamdar",
    packages=find_packages(),
    entry_points={"console_scripts": ["controller = main:start",],},
    license="MIT",
    keywords=["room", "device", "controller"],
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: System Administrators",
        "Topic :: Internet :: WWW/HTTP :: WSGI :: Server",
        "Natural Language :: English",
        "Operating System :: Linux",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.5",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
    ],
)
